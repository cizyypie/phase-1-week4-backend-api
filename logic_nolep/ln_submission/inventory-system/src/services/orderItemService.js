import status from 'http-status';
import prisma from '../../prisma/index.js';
import ApiError from '../utils/ApiError.js';

const createOrderItem = async (body) => {
  const { orderId, productId, quantity } = body;

  // check order exists
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  // check product exists and has enough stock
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  if (product.quantityInStock < quantity) {
    throw new ApiError(
      status.BAD_REQUEST,
      `Insufficient stock for product: ${product.name}. Available: ${product.quantityInStock}`,
    );
  }

  // create orderItem + decrement stock + update order totalPrice in transaction
  return prisma.$transaction(
    async (tx) => {
      const orderItem = await tx.orderItem.create({
        data: {
          quantity,
          unitPrice: product.price,
          order: { connect: { id: orderId } },
          product: { connect: { id: productId } },
        },
        include: { product: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: { quantityInStock: { decrement: quantity } },
      });

      // recalculate order totalPrice
      await tx.order.update({
        where: { id: orderId },
        data: {
          totalPrice: { increment: product.price * quantity },
        },
      });

      return orderItem;
    },
    { timeout: 15000 },
  );
};

const getAllOrderItems = async () => {
  return prisma.orderItem.findMany({
    include: { product: true, order: true },
  });
};

const getOrderItemById = async (id) => {
  return prisma.orderItem.findUnique({
    where: { id },
    include: { product: true, order: true },
  });
};

const getOrderItemsByOrderId = async (orderId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  return prisma.orderItem.findMany({
    where: { orderId },
    include: { product: true },
  });
};

const updateOrderItemById = async (orderItemId, updateBody) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'OrderItem not found');
  }

  const { quantity } = updateBody;
  const product = await prisma.product.findUnique({
    where: { id: orderItem.productId },
  });

  const quantityDiff = quantity - orderItem.quantity; // positive = more, negative = less

  if (quantityDiff > 0 && product.quantityInStock < quantityDiff) {
    throw new ApiError(
      status.BAD_REQUEST,
      `Insufficient stock for product: ${product.name}. Available: ${product.quantityInStock}`,
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const updated = await tx.orderItem.update({
        where: { id: orderItemId },
        data: { quantity },
        include: { product: true },
      });

      // adjust stock based on difference
      await tx.product.update({
        where: { id: orderItem.productId },
        data: { quantityInStock: { decrement: quantityDiff } },
      });

      // adjust order totalPrice based on difference
      await tx.order.update({
        where: { id: orderItem.orderId },
        data: {
          totalPrice: { increment: product.price * quantityDiff },
        },
      });

      return updated;
    },
    { timeout: 15000 },
  );
};

const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'OrderItem not found');
  }

  return prisma.$transaction(
    async (tx) => {
      await tx.orderItem.delete({ where: { id: orderItemId } });

      // restore stok
      await tx.product.update({
        where: { id: orderItem.productId },
        data: { quantityInStock: { increment: orderItem.quantity } },
      });

      await tx.order.update({
        where: { id: orderItem.orderId },
        data: {
          totalPrice: { decrement: orderItem.unitPrice * orderItem.quantity },
        },
      });
    },
    { timeout: 15000 },
  );
};

export {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  updateOrderItemById,
  deleteOrderItemById,
};

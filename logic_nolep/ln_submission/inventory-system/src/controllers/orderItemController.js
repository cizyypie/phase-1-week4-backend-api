import status from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import { orderItemService } from '../services/index.js';

const createOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.createOrderItem(req.body);
  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create OrderItem Success',
    data: orderItem,
  });
});

const getOrderItems = catchAsync(async (req, res) => {
  const orderItems = await orderItemService.getAllOrderItems();
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get OrderItems Success',
    data: orderItems,
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) throw new ApiError(status.NOT_FOUND, 'OrderItem not found');
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get OrderItem Success',
    data: orderItem,
  });
});

const getOrderItemsByOrder = catchAsync(async (req, res) => {
  const orderItems = await orderItemService.getOrderItemsByOrderId(req.params.orderId);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get OrderItems By Order Success',
    data: orderItems,
  });
});

const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItemById(
    req.params.orderItemId,
    req.body
  );
  res.status(status.OK).send({
    status: status.OK,
    message: 'Update OrderItem Success',
    data: orderItem,
  });
});

const deleteOrderItem = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete OrderItem Success',
    data: null,
  });
});

export {
  createOrderItem,
  getOrderItems,
  getOrderItem,
  getOrderItemsByOrder,
  updateOrderItem,
  deleteOrderItem,
};
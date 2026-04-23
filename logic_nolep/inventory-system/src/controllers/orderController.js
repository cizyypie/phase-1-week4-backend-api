import { status } from 'http-status';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { orderService } from '../services/index.js';

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user.id);
  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create Order Success',
    data: order,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Orders Success',
    data: orders,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) throw new ApiError(status.NOT_FOUND, 'Order not found');
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Order Success',
    data: order,
  });
});

const getOrdersByUser = catchAsync(async (req, res) => {
  const orders = await orderService.getOrdersByUserId(req.params.userId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Orders By User Success',
    data: orders,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Order Success',
    data: order,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete Order Success',
    data: null,
  });
});

export { createOrder, getOrders, getOrder, getOrdersByUser, updateOrder, deleteOrder };
import express from 'express';
import auth from '../middlewares/auth.js';
import authorization from '../middlewares/authorization.js';
import validate from '../middlewares/validate.js';
import { orderValidation, orderItemValidation } from '../validations/index.js';
import * as orderController from '../controllers/orderController.js';
import * as orderItemController from '../controllers/orderItemController.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), authorization('admin'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(), authorization('admin'), orderController.getOrders);

router
  .route('/:orderId')
  .get(auth(), authorization('admin'), validate(orderValidation.getOrder), orderController.getOrder)
  .put(auth(), authorization('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), authorization('admin'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

router.get(
  '/:orderId/order-items',
  auth(),
  authorization('admin'),
  validate(orderItemValidation.getOrderItemsByOrder),
  orderItemController.getOrderItemsByOrder
);

export default router;
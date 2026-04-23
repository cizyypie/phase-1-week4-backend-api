import express from 'express';
import auth from '../middlewares/auth.js';
import authorization from '../middlewares/authorization.js';
import validate from '../middlewares/validate.js';
import { orderItemValidation } from '../validations/index.js';
import * as orderItemController from '../controllers/orderItemController.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), authorization('admin'), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(auth(), authorization('admin'), orderItemController.getOrderItems);

router
  .route('/:orderItemId')
  .get(auth(), authorization('admin'), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .put(auth(), authorization('admin'), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), authorization('admin'), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

export default router;
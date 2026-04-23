import express from 'express';
import auth from '../middlewares/auth.js';
import authorization from '../middlewares/authorization.js';
import validate from '../middlewares/validate.js';
import * as validations from '../validations/index.js';
import * as userController from '../controllers/userController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router
  .route('/')
  .get(auth(), authorization('admin'), userController.getAllUsers)
  .post(auth(), authorization('admin'), validate(validations.userValidation.createUser), userController.createUser);

router
  .route('/:userId')
  .get(auth(), authorization('admin'), validate(validations.userValidation.getUser), userController.getUserById)
  .put(auth(), authorization('admin'), validate(validations.userValidation.updateUser), userController.updateUser)
  .delete(auth(), authorization('admin'), validate(validations.userValidation.deleteUser), userController.deleteUser);

router.get(
  '/:userId/products',
  auth(),
  validate(validations.productValidation.getProductsByUser),
  productController.getProductsByUser
);

router.get(
  '/:userId/orders',
  auth(),
  validate(validations.orderValidation.getOrdersByUser),
  orderController.getOrdersByUser
);

export default router;
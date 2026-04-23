import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { productValidation } from '../validations/index.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getProduct), productController.getProduct)
  .put(auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

export default router;
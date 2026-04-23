import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { categoryValidation } from '../validations/index.js';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth(), validate(categoryValidation.getCategories), categoryController.getCategories)

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidation.getCategory), categoryController.getCategory)
  .put(auth(), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth(), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

export default router;

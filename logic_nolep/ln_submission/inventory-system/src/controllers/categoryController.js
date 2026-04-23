import { status } from 'http-status';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { categoryService } from '../services/index.js';

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create Category Success',
    data: category,
  });
});

const getCategories = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await categoryService.queryCategorys({ page, size });
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Categorys Success',
    data: result.data,
    meta: result.meta,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) throw new ApiError(status.NOT_FOUND, 'Category not found');
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Category Success',
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Category Success',
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete Category Success',
    data: null,
  });
});

export { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
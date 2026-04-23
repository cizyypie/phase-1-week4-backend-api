import { status } from 'http-status';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { productService } from '../services/index.js';

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id);
  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const { category, page, size } = req.query;
  const result = await productService.getAllProducts({ 
    category, 
    page: Number(page),   
    size: Number(size),   
  });
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Products Success',
    data: result.data,
    meta: result.meta,
  });
});

const getProductsByUser = catchAsync(async (req, res) => {
  const products = await productService.getProductsByUserId(req.params.userId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Products By User Success',
    data: products,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) throw new ApiError(status.NOT_FOUND, 'Product not found');
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Product Success',
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Product Success',
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete Product Success',
    data: null,
  });
});

export { createProduct, getProducts, getProduct, getProductsByUser, updateProduct, deleteProduct };
import status from 'http-status';
import prisma from '../../prisma/index.js';
import ApiError from '../utils/ApiError.js';

const createProduct = async (productBody, userId) => {
  return prisma.product.create({
    data: {
      name: productBody.name,
      description: productBody.description,
      price: productBody.price,
      quantityInStock: productBody.quantityInStock,
      category: {
        connect: { id: productBody.categoryId },
      },
      user: {
        connect: { id: userId },
      },
    },
    include: {
      category: true,
    },
  });
};

const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
};

const getProductsByUserId = async (userId) => {
  return prisma.product.findMany({
    where: { userId },
    include: {
      category: true,
    },
  });
};

const getAllProducts = async ({ category, page, size }) => {
  const pageNum = Number(page);
  const sizeNum = Number(size);
  const skip = (pageNum - 1) * sizeNum;

  const where = category ? { category: { name: { contains: category, mode: 'insensitive' } } } : {};

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take: sizeNum,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: pageNum,
      size: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    },
  };
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  const { categoryId, ...rest } = updateBody;

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...rest,
      ...(categoryId && {
        category: { connect: { id: categoryId } },
      }),
    },
    include: { category: true },
  });
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  return prisma.product.delete({ where: { id: productId } });
};

export { createProduct, getProductsByUserId, getProductById, getAllProducts, updateProductById, deleteProductById };

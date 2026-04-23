import status from 'http-status';
import prisma from '../../prisma/index.js';
import ApiError from '../utils/ApiError.js';

const createCategory = async (categoryBody) => {
  const existing = await prisma.category.findFirst({
    where: { name: categoryBody.name },
  });

  if (existing) {
    throw new ApiError(status.BAD_REQUEST, 'Category name already exists');
  }

  return prisma.category.create({ data: categoryBody });
};

const queryCategorys = async ({ page, size }) => {
  const skip = (page - 1) * size;
  const [data, total] = await Promise.all([prisma.category.findMany({ skip, take: size }), prisma.category.count()]);
  return { data, meta: { total, page, size, totalPages: Math.ceil(total / size) } };
};

const getCategoryById = async (id) => {
  return prisma.category.findFirst({
    where: {
      id: id,
    },
  });
};

const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(status.NOT_FOUND, 'Category not found');
  }

  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: updateBody,
  });

  return updateCategory;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(status.NOT_FOUND, 'Category not found');
  }

  const deleteCategorys = await prisma.category.deleteMany({
    where: {
      id: categoryId,
    },
  });

  return deleteCategorys;
};

export { createCategory, queryCategorys, getCategoryById, updateCategoryById, deleteCategoryById };

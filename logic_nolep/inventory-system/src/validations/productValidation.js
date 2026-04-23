import { z } from 'zod';
import { objectId } from './customValidation.js';

export const createProduct = {
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    quantityInStock: z.number().int().min(1, 'Stock must be at least 1'),
    categoryId: objectId,
  }),
};

export const getProducts = {
  query: z.object({
    category: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    size: z.coerce.number().int().positive().default(10),
  }),
};

export const getProduct = {
  params: z.object({
    productId: objectId,
  }),
};

export const updateProduct = {
  params: z.object({
    productId: objectId,
  }),
  body: z.object({
    name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      quantityInStock: z.number().int().min(0),
      categoryId: objectId,
  }).partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'body must have at least 1 field' }
  ),
};

export const deleteProduct = {
  params: z.object({
    productId: objectId,
  }),
};
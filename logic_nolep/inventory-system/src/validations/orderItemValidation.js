import { z } from 'zod';
import { objectId } from './customValidation.js';

export const createOrderItem = {
  body: z.object({
    orderId: objectId,
    productId: objectId,
    quantity: z.number().int().positive(),
  }),
};

export const getOrderItem = {
  params: z.object({
    orderItemId: objectId,
  }),
};

export const updateOrderItem = {
  params: z.object({
    orderItemId: objectId,
  }),
  body: z
    .object({
      quantity: z.number().int().positive(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'body must have at least 1 field',
    }),
};

export const deleteOrderItem = {
  params: z.object({
    orderItemId: objectId,
  }),
};

export const getOrderItemsByOrder = {
  params: z.object({
    orderId: objectId,
  }),
};
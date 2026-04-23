import { z } from 'zod';
import { objectId } from './customValidation.js';

export const createOrder = {
  body: z.object({
   customerName: z.string().min(1),
    customerEmail: z.string().email(),
    items: z
      .array(
        z.object({
          productId: objectId,
          quantity: z.number().int().positive(),
        })
      )
      .min(1, 'Order must have at least 1 item'),
  }),
};

export const getOrder = {
  params: z.object({
    orderId: objectId,
  }),
};

export const updateOrder = {
  params: z.object({
    orderId: objectId,
  }),
  body: z.object({
      customerName: z.string().min(1),
      customerEmail: z.string().email(),
  }).partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'body must have at least 1 field' }
  ),
};

export const deleteOrder = {
  params: z.object({
    orderId: objectId,
  }),
};

export const getOrdersByUser = {
  params: z.object({
    userId: objectId,
  }),
};
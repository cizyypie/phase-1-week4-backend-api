import { z } from 'zod';
import { objectId, password } from './customValidation.js';

export const createUser = {
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: password,
    role: z.enum(['user', 'admin']).default('user'),
  }),
};

export const getUser = {
  params: z.object({
    userId: objectId,
  }),
};

export const updateUser = {
  params: z.object({
    userId: objectId,
  }),
  body: z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      password: password,
      role: z.enum(['user', 'admin']),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'body must have at least 1 field',
    }),
};

export const deleteUser = {
  params: z.object({
    userId: objectId,
  }),
};

export const getUsersByUser = {
  params: z.object({
    userId: objectId,
  }),
};
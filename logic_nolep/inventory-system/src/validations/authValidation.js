import { z } from 'zod';
import { password } from './customValidation.js';

export const register = {
  body: z.object({
    email: z.string().email(),
    password: password,
    name: z.string().min(1),
  }),
};

export const login = {
  body: z.object({
    email: z.string().min(1),
    password: z.string().min(1),
  }),
};
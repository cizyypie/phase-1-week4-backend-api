import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),          // min(1) prevents empty strings
  email: z.string().email("Must be a valid email"),     // validates email format
  phone: z.string().optional(),                         // optional field
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});
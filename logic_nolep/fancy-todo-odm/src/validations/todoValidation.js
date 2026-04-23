import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"], {
    errorMap: () => ({ message: "Status must be pending, in_progress, or done" })
  }),
  userId: z.string().min(1, "User ID is required"),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).optional(),
});
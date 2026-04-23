import prisma from "../../prisma/client.js";

export const getAllTodo = async () => {
  return await prisma.todo.findMany();
};

export const getTodoById = async (id, user) => {
  return await prisma.todo.findUnique({
    where: { id },
    include: { user: true }
  });
};

export const createTodo = async (data) => {
  return await prisma.todo.create({
    data,
  });
};

export const updateTodo = async (id, data) => {
  return await prisma.todo.update({
    where: { id },
    data,
  });
};

export const deleteTodo = async (id) => {
  return await prisma.todo.delete({
    where: { id },
  });
};
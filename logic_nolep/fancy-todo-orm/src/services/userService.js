import prisma from "../../prisma/client.js";

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { todos: true }, //note: include-> singkatnya buat JOIN 
  });
};

export const createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};
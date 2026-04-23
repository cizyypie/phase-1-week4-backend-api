import status from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../prisma/index.js';
import ApiError from '../utils/ApiError.js';

const createUser = async (userBody) => {
  const existing = await prisma.user.findUnique({ where: { email: userBody.email } });
  if (existing) {
    throw new ApiError(status.BAD_REQUEST, 'Email already taken');
  }

  userBody.password = bcrypt.hashSync(userBody.password, 8);
  return prisma.user.create({ data: userBody });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  if (updateBody.password) {
    updateBody.password = bcrypt.hashSync(updateBody.password, 8);
  }

  return prisma.user.update({ where: { id: userId }, data: updateBody });
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  return prisma.user.delete({ where: { id: userId } });
};

export { createUser, getUserById, getAllUsers, updateUserById, deleteUserById };

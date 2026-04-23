import status from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../prisma/index.js';
import ApiError from '../utils/ApiError.js';
import { createUser } from './userService.js';

const register = async (userBody) => {
  return createUser(userBody);
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(status.UNAUTHORIZED, 'Incorrect email or password');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(status.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user;
};

const logout = async () => {
  return true;
};

export { register, login, logout };

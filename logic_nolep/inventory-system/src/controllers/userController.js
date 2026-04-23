import status from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import { userService } from '../services/index.js';

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create User Success',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get All Users Success',
    data: users,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) throw new ApiError(status.NOT_FOUND, 'User not found');
  res.status(status.OK).send({
    status: status.OK,
    message: 'Get User Success',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Update User Success',
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete User Success',
    data: null,
  });
});

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
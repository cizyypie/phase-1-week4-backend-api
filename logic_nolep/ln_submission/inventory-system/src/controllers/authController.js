import status from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as tokenService from '../services/tokenService.js';
import { authService } from '../services/index.js';

const register = catchAsync(async (req, res) => {
  const userCreated = await authService.register(req.body);
  const tokens = await tokenService.generateAuthTokens(userCreated);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Register Success',
    data: { userCreated, tokens },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Login Success',
    data: { user, tokens },
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout();

  res.status(status.OK).send({
    status: status.OK,
    message: 'Logout Success',
    data: null,
  });
});

export { register, login, logout };
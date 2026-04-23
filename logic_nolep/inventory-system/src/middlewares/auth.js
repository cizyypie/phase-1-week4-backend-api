import jwtPkg from 'jsonwebtoken';
const { verify } = jwtPkg;
import config from '../config/config.js';
import ApiError from '../utils/ApiError.js';
import status from 'http-status';
import prisma from '../../prisma/index.js';

const auth = () => async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
  }

  try {
    const payload = verify(token, config.jwt.secret);

    if (payload.type !== 'access') {
      return next(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return next(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
  }
};

export default auth;

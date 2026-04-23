import ApiError from '../utils/ApiError.js';
import status from 'http-status';

const authorization = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(
      new ApiError(status.FORBIDDEN, 'You do not have permission to perform this action')
    );
  }

  return next();
};

export default authorization;
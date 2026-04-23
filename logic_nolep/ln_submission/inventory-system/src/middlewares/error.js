import config from '../config/config.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import { Prisma } from '@prisma/client';
import status from 'http-status';

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    // if error from axios or http request
    if (error.response) {
      const message = err.response.data.message || err.response.data;
      const statusCode = error.response.status;
      logger.info('handleAxiosError');
      error = new ApiError(statusCode, message, false, err.stack);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // Handling Prisma Error
      logger.info('handlePrismaError');
      error = handlePrismaClientError(err);
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
      // Handle initialization errors (e.g., connection issues)
      error = new ApiError(500, `Prisma Initialization Error: Database Connection Issues`);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      // Handle validation errors (e.g., invalid input data)
      console.error(':', err.message);
      error = new ApiError(500, `Prisma Validation Error: Invalid Input Data`);
    } else {
      // Handling Global Error
      const statusCode = error.statusCode || 500;
      const message = error.message || status[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

const handlePrismaClientError = (err) => {
  switch (err.code) {
    case 'P2002':
      // handling duplicate key errors
      return new ApiError(400, `Duplicate field value: ${err.meta.target}`, false, err.stack);
    case 'P2014':
      // handling invalid id errors
      return new ApiError(400, `Invalid ID: ${err.meta.target}`, false, err.stack);
    case 'P2003':
      // handling invalid data errors
      return new ApiError(400, `Invalid input data: ${err.meta.target}`, false, err.stack);
    case 'P2025':
      // record not found / foreign key not found
      return new ApiError(400, `Related record not found: ${err.meta?.cause || err.meta?.target}`, false, err.stack);
    default:
      // handling all other errors
      return new ApiError(500, `Something went wrong: ${err.message}`, false, err.stack);
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = status[status.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };

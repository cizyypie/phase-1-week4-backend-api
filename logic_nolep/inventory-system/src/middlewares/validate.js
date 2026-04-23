import { status } from 'http-status';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const errors = [];

  for (const key of Object.keys(validSchema)) {
    const result = validSchema[key].safeParse(object[key]);

    if (!result.success) {
      const issues = result.error?.issues ?? [];
      issues.forEach((err) => {
        errors.push(err.message);
      });
    } else {
      req[key] = result.data;
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(status.BAD_REQUEST, errors.join(', ')));
  }

  return next();
};

export default validate;
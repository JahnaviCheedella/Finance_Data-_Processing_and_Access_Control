import { sendError } from '../utils/response.js';

export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = source === 'body' ? req.body : req.query;
      const parsed = schema.parse(dataToValidate);
      
      // Replace request data with parsed/sanitized data from Zod
      if (source === 'body') req.body = parsed;
      else req.query = parsed;
      
      next();
    } catch (error) {
      const errors = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return sendError(res, 400, 'Validation failed', errors);
    }
  };
};

import { validationResult } from 'express-validator';
import { AppError } from '../utils/app.error.js';

export function handleValidation(req, res, next) {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return next(new AppError(erros.array()[0].msg, 400));
  }

  next();
}
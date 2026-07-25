import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Token não informado', 401));
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new AppError('Token inválido', 401));
  }
}
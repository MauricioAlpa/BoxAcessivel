import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { Validacoes } from '../validations/auth.validation.js';
import { handleValidation } from '../middlewares/handleValidation.middleware.js';

export const AuthRouter = Router();

AuthRouter.post(
  '/login',
  Validacoes.validaLogin(),
  handleValidation,
  AuthController.login
);
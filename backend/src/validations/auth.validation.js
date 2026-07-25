import { body } from 'express-validator';

export const Validacoes = {
  validaLogin: () => [
    body('email')
      .isEmail().withMessage('E-mail inválido'),
    body('senha')
      .notEmpty().withMessage('Senha é obrigatória'),
  ],
};
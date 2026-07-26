import { body } from 'express-validator';

export const Validacoes = {
  validaCriarLead: () => [
    body('nome')
      .notEmpty().withMessage('Nome é obrigatório')
      .isLength({ max: 50 }).withMessage('Nome muito longo'),
    body('email')
      .isEmail().withMessage('E-mail inválido'),
    body('telefone')
      .isLength({ min: 10, max: 11 }).withMessage('Telefone inválido'),
    body('consentimento')
      .equals('true').withMessage('É necessário aceitar o uso dos dados'),
  ],

  validaAtualizaStatus: () => [
    body('status')
      .isIn([
        '1. Novo Lead',
        '2. Em Contato',
        '3. Proposta Enviada',
        '4. Negociando',
        '5. Fechado',
      ])
      .withMessage('Status inválido'),
  ],
};
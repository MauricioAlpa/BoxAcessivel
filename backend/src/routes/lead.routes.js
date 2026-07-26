import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller.js';
import { Validacoes } from '../validations/lead.validation.js';
import { handleValidation } from '../middlewares/handleValidation.middleware.js';
import { autenticar } from '../middlewares/auth.middleware.js';

export const LeadRouter = Router();

LeadRouter.post(
  '/leads',
  Validacoes.validaCriarLead(),
  handleValidation,
  LeadController.criar
);

LeadRouter.get('/leads', autenticar, LeadController.listar);

LeadRouter.patch(
  '/leads/:id/status',
  autenticar,
  Validacoes.validaAtualizaStatus(),
  handleValidation,
  LeadController.atualizarStatus
);
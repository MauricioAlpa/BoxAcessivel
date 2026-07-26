import { Router } from 'express';
import  LeadController  from '../controllers/lead.controller.js';
import { Validacoes } from '../validations/lead.validation.js';
import { handleValidation } from '../middlewares/handleValidation.middleware.js';

export const LeadRouter = Router();

LeadRouter.post(
  '/leads',
  Validacoes.validaCriarLead(),
  handleValidation,
  LeadController.criar
);
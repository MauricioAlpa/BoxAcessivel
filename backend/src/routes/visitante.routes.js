import { Router } from 'express';
import { VisitanteController } from '../controllers/visitante.controller.js';

export const VisitanteRouter = Router();

VisitanteRouter.post('/visitas', VisitanteController.registrar);
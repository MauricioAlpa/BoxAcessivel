import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

export const MetricsRouter = Router();

MetricsRouter.get('/metrics/conversao', autenticar, MetricsController.conversao);
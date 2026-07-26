import { Router } from 'express';
import { AuthRouter } from './auth.routes.js';
import { LeadRouter } from './lead.routes.js';
import { VisitanteRouter } from './visitante.routes.js';
import { MetricsRouter } from './metrics.routes.js';
import { rotaNaoEncontrada, tratarErro } from '../middlewares/error.middleware.js';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/', LeadRouter);
router.use('/', VisitanteRouter);
router.use('/', MetricsRouter);

router.use(rotaNaoEncontrada);
router.use(tratarErro);

export default router;
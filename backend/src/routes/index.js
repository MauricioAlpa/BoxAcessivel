import { Router } from 'express';
import { AuthRouter } from './auth.routes.js';
import { rotaNaoEncontrada, tratarErro } from '../middlewares/error.middleware.js';

const router = Router();

router.use('/auth', AuthRouter);

router.use(rotaNaoEncontrada);
router.use(tratarErro);

export default router;
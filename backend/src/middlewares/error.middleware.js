import { AppError } from '../utils/app.error.js';

export function rotaNaoEncontrada(req, res, next) {
  next(new AppError(`Rota ${req.originalUrl} não existe`, 404));
}

export function tratarErro(err, req, res, next) {
  if (err.code === '23505') {
    return res.status(409).json({ erro: 'Registro já existe' });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }

  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findAdminByEmail } from '../models/admin.model.js';
import { AppError } from '../utils/app.error.js';

export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new AppError('E-mail e senha são obrigatórios', 400);
    }

    const admin = await findAdminByEmail(email);
    if (!admin) throw new AppError('Credenciais inválidas', 401);

    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaValida) throw new AppError('Credenciais inválidas', 401);

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}
import pool from '../config/database.js';
import { AppError } from '../utils/AppError.js';

export async function criarOuReativarLead({ nome, email, telefone }) {
  try {
    const result = await pool.query(
      `INSERT INTO lead (nome, email, telefone)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET atualizado_em = now()
       RETURNING *`,
      [nome, email, telefone]
    );
    return result.rows[0];
  } catch (err) {
    throw new AppError('Erro ao registrar lead', 500);
  }
}
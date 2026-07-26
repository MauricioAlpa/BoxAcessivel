import pool from '../config/database.js';
import { AppError } from '../utils/app.error.js';

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

export async function contarLeads() {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM lead');
    return result.rows[0].total;
  } catch (err) {
    throw new AppError('Erro ao contar leads', 500);
  }
}

export async function listarLeads() {
  try {
    const result = await pool.query(
      `SELECT id, nome, email, telefone, status, criado_em, atualizado_em
       FROM lead
       ORDER BY criado_em DESC`
    );
    return result.rows;
  } catch (err) {
    throw new AppError('Erro ao listar leads', 500);
  }
}

export async function atualizarStatusLead(id, status) {
  try {
    const result = await pool.query(
      `UPDATE lead SET status = $1, atualizado_em = now() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) {
      throw new AppError('Lead não encontrado', 404);
    }
    return result.rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Erro ao atualizar status do lead', 500);
  }
}
import pool from '../config/database.js';
import { AppError } from '../utils/app.error.js';

export async function registrarVisita({ ipHash, origem }) {
  try {
    const result = await pool.query(
      `INSERT INTO visitante (ip_hash, origem) VALUES ($1, $2) RETURNING id`,
      [ipHash, origem ?? null]
    );
    return result.rows[0];
  } catch (err) {
    throw new AppError('Erro ao registrar visita', 500);
  }
}

export async function contarVisitas() {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM visitante');
    return result.rows[0].total;
  } catch (err) {
    throw new AppError('Erro ao contar visitas', 500);
  }
}
import pool from '../config/database.js';
import { AppError } from '../utils/app.error.js';

export async function findAdminByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM adm WHERE user_login = $1',
      [email]
    );
    return result.rows[0];
  } catch (err) {
    throw new AppError('Erro ao buscar administrador', 500);
  }
}
  

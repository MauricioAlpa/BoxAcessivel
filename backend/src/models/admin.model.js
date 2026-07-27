import pool from '../config/database.js';
  import { AppError } from '../utils/app.error.js';

export async function findAdminByEmail(email) {
  try {
    console.log('Login recebido:', email);
    const result = await pool.query(
      'SELECT * FROM app.adm WHERE user_login = $1',
      [email]
    );

    console.log('Resultado da consulta:', result.rows);
    return result.rows[0];
  } catch (err) {
    throw new AppError('Erro ao buscar administrador', 500);
  }
}
  

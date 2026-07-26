import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import 'dotenv/config';

async function criarAdmin() {
  const email = 'admin@boxacessivel.com.br';
  const senha = '123456'; // troca por uma senha real antes da entrega

  const senhaHash = await bcrypt.hash(senha, 10);

  await pool.query(
    'INSERT INTO adm (user_login, senha_hash) VALUES ($1, $2)',
    [email, senhaHash]
  );

  console.log('Admin criado:', email);
  process.exit(0);
}

criarAdmin().catch((err) => {
  console.error('Erro ao criar admin:', err);
  process.exit(1);
});
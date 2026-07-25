import pg from 'pg';
import 'dotenv/config';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

export async function query(text, params) {
  const start = Date.now();
  const res = await sql(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text: text.substring(0, 100), duration, rows: res.length });
  return { rows: res, rowCount: res.length };
}

export async function getClient() {
  return sql;
}

export default sql;
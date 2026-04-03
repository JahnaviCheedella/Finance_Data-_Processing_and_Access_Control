import pkg from 'pg';
const { Pool } = pkg;
import { ENV } from './env.js';

export const pool = new Pool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
  process.exit(-1);
});

export const db = {
  query: (text, params) => pool.query(text, params),
};

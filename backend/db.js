import pkg from 'pg';

const { Pool } = pkg;

// **TESTE: Cole a string de conexão COMPLETA aqui, substituindo a senha.**
const SUPABASE_URI = "postgresql://postgres:senhaSupaBase192@db.kaljaooxbohmxcuzbagm.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString: SUPABASE_URI,
  ssl: {
      rejectUnauthorized: false
  }
});

export default pool;
import pkg from 'pg';

const { Pool } = pkg;

// --- DEBUG ---
// Verifica se a DATABASE_URL foi carregada pelo server.js
if (!process.env.DATABASE_URL) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("ERRO DE DEBUG: 'DATABASE_URL' NÃO ENCONTRADA!");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
} else {
    console.log(`DEBUG: Variável DATABASE_URL encontrada: ${process.env.DATABASE_URL.substring(0, 30)}...`);
}

// Configuração para o Pool
const pool = new Pool({
    // Usa a variável de ambiente DATABASE_URL que deve ser definida no .env
    connectionString: process.env.DATABASE_URL,
    
    // Configuração CRÍTICA para o Supabase (requer conexão SSL)
    ssl: {
        rejectUnauthorized: false
    }
});

// --- Rede de Segurança do Pool
// Captura erros que ocorrem durante a inatividade ou reconexão
pool.on('error', (err, client) => {
    console.error('[ERRO INESPERADO NO POOL DE CONEXÃO]', 'Cliente ocioso teve um erro:', err.message, err.stack);
});

export default pool;
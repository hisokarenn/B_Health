import "./config.js";
// --- INÍCIO DA CORREÇÃO DOTENV ---
// Carregamento explícito para Módulos ES ("type": "module")
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Recria o '__dirname' que não existe em Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env explicitamente do diretório ATUAL (backend)
const envResult = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (envResult.error) {
    console.error("ERRO GRAVE DO DOTENV:", envResult.error);
}
// --- FIM DA CORREÇÃO ---

import express from 'express';
import cors from 'cors';
import pool from './db.js'; // Importa o pool (que ainda não conectou)

// CONFIGURAÇÕES GLOBAIS
const app = express();
// A porta será lida do .env ou usará 3000 como padrão
const port = process.env.PORT || 3000; 

// MIDDLEWARES
app.use(cors()); 
app.use(express.json()); 

// --- ROTAS (Todas as suas rotas /pacientes, /login, etc. vêm aqui) ---
app.get('/', (req, res) => {
    res.send('API B Health (Node.js/PostgreSQL) rodando!');
});

// --- Rota de Cadastro de Paciente (RF01) ---
app.post('/pacientes', async (req, res) => {
    try {
        const { nome, cpf, cns, email, senha} = req.body;
        
        if (!nome || !cpf || !cns || !email || !senha) {
            return res.status(400).json({ error: 'Nome, CPF, CNS, E-mail e Senha são campos obrigatórios.' });
        }
        
        const senhaPura = senha; 

        const result = await pool.query(
            `INSERT INTO pessoas (nome, cpf, cns, email, senha) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, nome, email`,
            [nome, cpf, cns, email, senhaPura]
        );

        res.status(201).json({ 
            message: 'Paciente cadastrado com sucesso!', 
            paciente: result.rows[0] 
        });

    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ error: 'Erro de Duplicidade: CPF, CNS ou E-mail informado já está em uso.' });
        }
        console.error('Erro ao cadastrar paciente:', error);
        res.status(500).json({ error: 'Erro interno do servidor. Verifique o log da API.' });
    }
});

// --- Rota de Login de Paciente (RF02) ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e Senha são obrigatórios para realizar o login.' });
    }

    try {
        const result = await pool.query(
            'SELECT id, nome, email, senha FROM pessoas WHERE email = $1',
            [email]
        );

        const paciente = result.rows[0];

        if (!paciente) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        if (paciente.senha !== senha) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        res.status(200).json({ 
            message: 'Login bem-sucedido!', 
            usuario: { id: paciente.id, nome: paciente.nome, email: paciente.email } 
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao tentar realizar o login.' });
    }
});

// --- Rota de Visualização do Histórico (RF03) ---
app.get('/historico/:pacienteId', async (req, res) => {
    const pacienteId = parseInt(req.params.pacienteId);

    try {
        const result = await pool.query(
            `SELECT
                d.dose_numero AS dose, 
                TO_CHAR(d.data_aplicacao, 'DD/MM/YYYY') AS data_aplicacao, 
                v.nome AS nome_vacina, 
                u.nome AS unidade_saude 
            FROM doses_aplicadas d
            JOIN vacinas v ON d.vacina_id = v.id
            JOIN unidades_saude u ON d.unidade_saude_id = u.id
            WHERE d.paciente_id = $1
            ORDER BY d.data_aplicacao DESC`,
            [pacienteId]
        );

        const historico = result.rows;

        if (historico.length === 0) {
            return res.status(200).json({ 
                message: 'Nenhum registro de vacina encontrado para este paciente.',
                historico: []
            });
        }
        
        res.status(200).json({ historico: historico });

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ error: 'Erro interno ao consultar o histórico de vacinas.' });
    }
});

// --- Rota de Visualização de Campanhas (RF04) ---
app.get('/campanhas', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                titulo,
                tipo_vacina,
                publico_alvo,
                TO_CHAR(data_inicio, 'DD/MM/YYYY') AS data_inicio,
                TO_CHAR(data_fim, 'DD/MM/YYYY') AS data_fim,
                locais_aplicacao
            FROM campanhas
            WHERE data_fim >= CURRENT_DATE
            ORDER BY data_inicio ASC`
        );

        const campanhas = result.rows;

        if (campanhas.length === 0) {
            return res.status(200).json({ 
                message: 'Nenhuma campanha ativa encontrada no momento.',
                campanhas: []
            });
        }
        
        res.status(200).json({ campanhas: campanhas });

    } catch (error) {
        console.error('Erro ao buscar campanhas:', error);
        res.status(500).json({ error: 'Erro interno ao consultar campanhas de vacinação.' });
    }
});
// --- FIM DAS ROTAS ---


// --- NOVA FUNÇÃO DE INICIALIZAÇÃO ---
const startServer = async () => {
    try {
        // 1. Tenta pegar um cliente do pool (Testa a conexão)
        const client = await pool.connect();
        console.log("Conexão com o Supabase estabelecida com sucesso! O Pool está pronto.");
        client.release(); // Libera o cliente

        // 2. SÓ ENTÃO inicia o servidor
        app.listen(port, () => {
            console.log(`Servidor API B Health rodando na porta ${port}`);
        });

    } catch (err) {
        console.error("Erro CRÍTICO: Falha ao conectar ao Supabase (DB) na inicialização:", err.message);
        process.exit(1); // Encerra o processo se não conseguir conectar ao DB
    }
};

// --- INICIA O SERVIDOR ---
startServer();


// --- Handlers Globais de Erro (Mantém) ---
process.on('uncaughtException', (err) => {
    console.error('[ERRO GRAVE (Exceção Não Capturada)]', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[ERRO GRAVE (Rejeição Não Capturada)]', 'Uma Promise falhou:', reason);
});

// --- SOLUÇÃO "KEEP-ALIVE" ---
// Impede que o processo do Node.js encerre sozinho (comum no Git Bash/Windows)
// Isto força o loop de eventos a permanecer ativo.
setInterval(() => {
    // Esta função não faz nada, mas mantém o processo "ocupado".
}, 1000 * 60 * 60); // Executa a cada hora (o tempo é irrelevante)

console.log("Processo 'keep-alive' iniciado para manter o servidor ativo.");
// --- FIM DA SOLUÇÃO ---
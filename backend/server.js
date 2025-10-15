import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js'; 
// REMOVIDO: import bcrypt from 'bcrypt'; 
// REMOVIDO: import de bibliotecas de segurança

// CONFIGURAÇÕES GLOBAIS
const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors()); 
app.use(express.json()); 

// Rota de Teste
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
        
        // CÓDIGO ALTERADO: A senha é salva como texto puro (sem criptografia)
        const senhaPura = senha; 

        const result = await pool.query(
            `INSERT INTO pessoas (nome, cpf, cns, email, senha) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, nome, email`,
            [nome, cpf, cns, email, senhaPura] // Usa a senha pura
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

        // CÓDIGO ALTERADO: Comparação de string pura (sem bcrypt.compare)
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
// ... (restante do código da rota histórico) ...
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
// ... (restante do código da rota campanhas) ...
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


// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor API B Health rodando na porta ${port}`);
});

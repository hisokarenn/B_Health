import "./config.js";
import express from 'express';
import cors from 'cors';
import db from './firebase.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// Rota de Teste
app.get('/', (req, res) => {
    res.send('API B Health (Node.js + Firebase Firestore) rodando!');
});

// --- Rota de Cadastro de Paciente ---
app.post('/pacientes', async (req, res) => {
    try {
        const { nome, cpf, cns, email, senha } = req.body;
        
        if (!nome || !cpf || !cns || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // 1. Verifica se já existe usuário com este email
        const userQuery = await db.collection('pacientes').where('email', '==', email).get();
        if (!userQuery.empty) {
            return res.status(409).json({ error: 'E-mail já cadastrado.' });
        }

        // 2. Cria o objeto do paciente
        const novoPaciente = {
            nome,
            cpf,
            cns,
            email,
            senha, // Nota: Em produção, use bcrypt aqui!
            createdAt: new Date().toISOString()
        };

        // 3. Salva na coleção 'pacientes'
        const docRef = await db.collection('pacientes').add(novoPaciente);

        res.status(201).json({ 
            message: 'Paciente cadastrado com sucesso!', 
            paciente: { id: docRef.id, ...novoPaciente } 
        });

    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// --- Rota de Login de Paciente ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });
    }

    try {
        // Busca usuário pelo email na coleção
        const snapshot = await db.collection('pacientes').where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // Pega o primeiro documento encontrado
        const doc = snapshot.docs[0];
        const paciente = doc.data();

        // Verifica senha (texto puro conforme seu pedido anterior)
        if (paciente.senha !== senha) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        res.status(200).json({ 
            message: 'Login bem-sucedido!', 
            usuario: { id: doc.id, nome: paciente.nome, email: paciente.email } 
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// --- Rota: Buscar Perfil do Paciente ---
app.get('/pacientes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Busca o documento pelo ID gerado pelo Firebase
        const doc = await db.collection('pacientes').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Paciente não encontrado.' });
        }

        const dados = doc.data();
        
        delete dados.senha;

        res.status(200).json(dados);

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// --- Rota de Visualização do Histórico ---
app.get('/historico/:pacienteId', async (req, res) => {
    const { pacienteId } = req.params;

    try {
        // Busca na coleção 'historico' onde o campo pacienteId é igual ao solicitado
        const snapshot = await db.collection('historico')
            .where('pacienteId', '==', pacienteId)
            .get();

        if (snapshot.empty) {
            return res.status(200).json({ 
                message: 'Nenhum registro encontrado.',
                historico: []
            });
        }

        // Mapeia os documentos para um array
        const historico = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json({ historico: historico });

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// --- Rota de Visualização de Campanhas ---
app.get('/campanhas', async (req, res) => {
    try {
        const snapshot = await db.collection('campanhas').get();

        if (snapshot.empty) {
            return res.status(200).json({ 
                message: 'Nenhuma campanha ativa.',
                campanhas: []
            });
        }

        const campanhas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json({ campanhas: campanhas });

    } catch (error) {
        console.error('Erro ao buscar campanhas:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// --- Rota Detalhe da Campanha ---
app.get('/campanhas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await db.collection('campanhas').doc(id).get();
        
        if (!doc.exists) {
            return res.status(404).json({ error: 'Campanha não encontrada.' });
        }

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// --- "KEEP-ALIVE" ---
// Impede que o processo do Node.js encerre sozinho em alguns ambientes.
setInterval(() => {
    // Esta função não faz nada, mas mantém o processo "ocupado".
}, 1000 * 60 * 60); // Roda a cada 1 hora
console.log("Processo 'keep-alive' iniciado para manter o servidor ativo.");

// Inicialização do servidor
app.listen(port, () => {
  console.log(`API B Health rodando na porta ${port} com Firebase!`);
});
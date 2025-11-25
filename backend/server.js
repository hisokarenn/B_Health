import "./config.js";
import express from 'express';
import cors from 'cors';
import db from './firebase.js';
mport { db, bucket } from './firebase.js'; // Importa db e bucket
import multer from 'multer'; // Importa multer para upload

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('API B Health (Node.js + Firebase Firestore) rodando!');
});

// --- Rota de Cadastro de Paciente (Híbrida - Auth + Firestore) ---
// Agora recebe o UID gerado pelo frontend/Firebase Auth
app.post('/pacientes', async (req, res) => {
    const { uid, nome, cpf, cns, email } = req.body;
    
    if (!uid || !nome || !cpf || !cns) {
        return res.status(400).json({ error: 'Dados incompletos para o cadastro.' });
    }

    try {
        // Verifica se CPF já existe (Regra de Negócio)
        const cpfQuery = await db.collection('pacientes').where('cpf', '==', cpf).get();
        if (!cpfQuery.empty) {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }

        await db.collection('pacientes').doc(uid).set({
            nome,
            cpf,
            cns,
            email,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ 
            message: 'Paciente cadastrado com sucesso!', 
            id: uid 
        });

    } catch (error) {
        console.error('Erro ao cadastrar no Firestore:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao salvar dados.' });
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
        if(snapshot.empty) return res.status(200).json({message: 'Nenhuma campanha ativa.', camapnhas: []});
        const camapnhas = snapshot.docs.map(doc =>({id: doc.id, ...doc.data()}));
        res.status(200).json({campanhas:camapnhas})
    }cath(error){
        console.error('Erro ao buscar campanhas:', error);
        res.status(500).json({error:'Erro interno.'};)
    }
});

// --- Rota Detalhe da Campanha ---
app.get('/campanhas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await db.collection('campanhas').doc(id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Campanha não encontrada.' });
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// Keep alive
setInterval(() => {}, 1000 * 60 * 60); 
console.log("Processo 'keep-alive' iniciado.");

// Inicialização do servidor
app.listen(port, () => {
  console.log(`API B Health rodando na porta ${port} com Firebase!`);
});
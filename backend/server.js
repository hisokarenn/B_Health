import "./config.js";
import express from 'express';
import cors from 'cors';
import { db, bucket, firebaseAuth } from './firebase.js'; 
import multer from 'multer'; 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('API B Health (Node.js + Firebase Firestore) rodando!');
});

const somenteDigitos = (value) => String(value || '').replace(/\D/g, '');
const textoLimpo = (value) => String(value || '').trim();
const emailGmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const formatarCpf = (value) => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
const formatarCns = (value) => value.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');

const criarErroHttp = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const obterTokenBearer = (req) => {
    const authorization = req.headers.authorization || '';
    const [tipo, token] = authorization.split(' ');

    if (tipo?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }

    return token;
};

const autenticarRequisicao = async (req, res, next) => {
    const token = obterTokenBearer(req);

    if (!token) {
        return res.status(401).json({
            error: 'Autenticação necessária para acessar este recurso.'
        });
    }

    try {
        req.usuarioAutenticado = await firebaseAuth.verifyIdToken(token);
        return next();
    } catch (error) {
        console.error('Falha ao validar token Firebase:', error);
        return res.status(401).json({
            error: 'Sessão inválida ou expirada. Faça login novamente.'
        });
    }
};

const autorizarMesmoPaciente = (parametroUid) => (req, res, next) => {
    const uidSolicitado = textoLimpo(req.params[parametroUid]);
    const uidAutenticado = textoLimpo(req.usuarioAutenticado?.uid);

    if (!uidAutenticado) {
        return res.status(401).json({
            error: 'Autenticação necessária para acessar este recurso.'
        });
    }

    if (uidSolicitado !== uidAutenticado) {
        return res.status(403).json({
            error: 'Você não tem permissão para acessar dados de outro paciente.'
        });
    }

    return next();
};

const existePacienteComValor = async (campo, valores, uidAtual) => {
    const valoresUnicos = [...new Set(valores.filter(Boolean))];

    for (const valor of valoresUnicos) {
        const snapshot = await db.collection('pacientes')
            .where(campo, '==', valor)
            .limit(1)
            .get();

        if (snapshot.docs.some((doc) => doc.id !== uidAtual)) {
            return true;
        }
    }

    return false;
};

app.post('/pacientes', async (req, res) => {
    const { uid, nome, cpf, cns, email } = req.body;
    const uidLimpo = textoLimpo(uid);
    const nomeLimpo = textoLimpo(nome);
    const cpfLimpo = textoLimpo(cpf);
    const cnsLimpo = textoLimpo(cns);
    const emailLimpo = textoLimpo(email).toLowerCase();
    const cpfNumeros = somenteDigitos(cpfLimpo);
    const cnsNumeros = somenteDigitos(cnsLimpo);
    
    if (!uidLimpo || !nomeLimpo || !cpfNumeros || !cnsNumeros || !emailLimpo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!emailGmailRegex.test(emailLimpo)) {
        return res.status(400).json({ error: 'Use um e-mail válido do domínio @gmail.com.' });
    }

    if (cpfNumeros.length !== 11) {
        return res.status(400).json({ error: 'O CPF deve conter 11 dígitos.' });
    }

    if (cnsNumeros.length !== 15) {
        return res.status(400).json({ error: 'O CNS deve conter 15 dígitos.' });
    }

    const cpfFormatado = formatarCpf(cpfNumeros);
    const cnsFormatado = formatarCns(cnsNumeros);

    try {
        const cpfDuplicado = await existePacienteComValor(
            'cpf',
            [cpfLimpo, cpfNumeros, cpfFormatado],
            uidLimpo
        ) || await existePacienteComValor(
            'cpfNormalizado',
            [cpfNumeros],
            uidLimpo
        );

        if (cpfDuplicado) {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }

        const cnsDuplicado = await existePacienteComValor(
            'cns',
            [cnsLimpo, cnsNumeros, cnsFormatado],
            uidLimpo
        ) || await existePacienteComValor(
            'cnsNormalizado',
            [cnsNumeros],
            uidLimpo
        );

        if (cnsDuplicado) {
            return res.status(409).json({ error: 'CNS já cadastrado.' });
        }

        const pacientesRef = db.collection('pacientes');
        const unicosRef = db.collection('paciente_unicos');
        const pacienteRef = pacientesRef.doc(uidLimpo);
        const cpfUnicoRef = unicosRef.doc(`cpf_${cpfNumeros}`);
        const cnsUnicoRef = unicosRef.doc(`cns_${cnsNumeros}`);
        const createdAt = new Date().toISOString();

        await db.runTransaction(async (transaction) => {
            const pacienteDoc = await transaction.get(pacienteRef);
            const cpfUnicoDoc = await transaction.get(cpfUnicoRef);
            const cnsUnicoDoc = await transaction.get(cnsUnicoRef);

            if (pacienteDoc.exists) {
                throw criarErroHttp(409, 'Paciente já cadastrado.');
            }

            if (cpfUnicoDoc.exists && cpfUnicoDoc.data().uid !== uidLimpo) {
                throw criarErroHttp(409, 'CPF já cadastrado.');
            }

            if (cnsUnicoDoc.exists && cnsUnicoDoc.data().uid !== uidLimpo) {
                throw criarErroHttp(409, 'CNS já cadastrado.');
            }

            transaction.set(cpfUnicoRef, {
                uid: uidLimpo,
                tipo: 'cpf',
                valor: cpfNumeros,
                createdAt,
            });

            transaction.set(cnsUnicoRef, {
                uid: uidLimpo,
                tipo: 'cns',
                valor: cnsNumeros,
                createdAt,
            });

            transaction.set(pacienteRef, {
                nome: nomeLimpo,
                cpf: cpfFormatado,
                cns: cnsFormatado,
                cpfNormalizado: cpfNumeros,
                cnsNormalizado: cnsNumeros,
                email: emailLimpo,
                createdAt,
            });
        });

        res.status(201).json({ 
            message: 'Paciente cadastrado com sucesso!', 
            id: uidLimpo
        });

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error('Erro ao cadastrar no Firestore:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao salvar dados.' });
    }
});

app.get('/pacientes/:id', autenticarRequisicao, autorizarMesmoPaciente('id'), async (req, res) => {
    const id = textoLimpo(req.params.id);

    try {
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

app.get('/historico/:pacienteId', autenticarRequisicao, autorizarMesmoPaciente('pacienteId'), async (req, res) => {
    const pacienteId = textoLimpo(req.params.pacienteId);

    try {
        const snapshot = await db.collection('historico')
            .where('pacienteId', '==', pacienteId)
            .get();

        if (snapshot.empty) {
            return res.status(200).json({ 
                message: 'Nenhum registro encontrado.',
                historico: []
            });
        }

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

app.get('/campanhas', async (req, res) => {
    try {
        const snapshot = await db.collection('campanhas').get();
        if(snapshot.empty) return res.status(200).json({message: 'Nenhuma campanha ativa.', campanhas: []});
        const campanhas = snapshot.docs.map(doc =>({id: doc.id, ...doc.data()}));
        res.status(200).json({campanhas:campanhas})
    }catch(error){
        console.error('Erro ao buscar campanhas:', error);
        res.status(500).json({error:'Erro interno.'});
    }
});

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

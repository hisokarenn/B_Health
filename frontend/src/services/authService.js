import axios from 'axios';
import { auth } from './firebaseConfig';
import { 
    deleteUser,
    sendPasswordResetEmail, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

// Se estiver testando localemnte, rode o backend localmente, use o IP da sua máquina (ex: 'http://192.168.1.15:3000')
const API_BASE_URL = 'https://b-health-app-api.onrender.com'; 

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const obterMensagemErroApi = (error) => {
    return error.response?.data?.error || error.response?.data?.message;
};

const normalizarEmail = (email) => String(email || '').trim().toLowerCase();

const validarEmail = (email) => emailRegex.test(normalizarEmail(email));

const erroSemInternet = (error) => {
    const message = String(error.message || '').toLowerCase();
    return error.code === 'auth/network-request-failed'
        || message.includes('network')
        || message.includes('offline');
};

const mensagemErroAutenticacao = (error, fallback) => {
    if (erroSemInternet(error)) {
        return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
    }

    if (
        error.code === 'auth/invalid-credential'
        || error.code === 'auth/user-not-found'
        || error.code === 'auth/wrong-password'
    ) {
        return 'E-mail ou senha incorretos.';
    }

    if (error.code === 'auth/invalid-email') {
        return 'E-mail inválido. Verifique o endereço informado.';
    }

    if (error.code === 'auth/too-many-requests') {
        return 'Muitas tentativas em sequência. Aguarde alguns minutos e tente novamente.';
    }

    return fallback;
};

const desfazerUsuarioFirebase = async (user) => {
    try {
        await deleteUser(user);
        return true;
    } catch (rollbackError) {
        console.error('Falha ao desfazer usuário criado no Firebase Auth:', rollbackError);
        return false;
    }
};

// Recuperar Senha (Nativa do Firebase)
export const solicitarRecuperacaoSenha = async (email) => {
    const emailLimpo = normalizarEmail(email);

    if (!emailLimpo) {
        throw new Error('Digite seu e-mail para recuperar a senha.');
    }

    if (!validarEmail(emailLimpo)) {
        throw new Error('E-mail inválido. Verifique o endereço informado.');
    }

    try {
        await sendPasswordResetEmail(auth, emailLimpo);
        return true;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('E-mail não cadastrado.');
        }

        throw new Error(
            mensagemErroAutenticacao(
                error,
                'Não foi possível enviar o e-mail de recuperação. Tente novamente.'
            )
        );
    }
};

// Cadastro Híbrido
export const cadastrarPaciente = async (dados) => {
    let user = null;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, dados.email, dados.senha);
        user = userCredential.user;
        await updateProfile(user, { displayName: dados.nome });
        await axios.post(`${API_BASE_URL}/pacientes`, {
            uid: user.uid, 
            nome: dados.nome,
            cpf: dados.cpf,
            cns: dados.cns,
            email: dados.email
        });
        return user;
    } catch (error) {
        if (user) {
            const rollbackRealizado = await desfazerUsuarioFirebase(user);
            const mensagemApi = obterMensagemErroApi(error) || 'Não foi possível concluir o cadastro do paciente.';

            if (rollbackRealizado) {
                throw new Error(mensagemApi);
            }

            throw new Error(`${mensagemApi} Não foi possível desfazer automaticamente o usuário no Firebase Auth.`);
        }

        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está em uso.');
        }
        if (error.code === 'auth/weak-password') {
            throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }

        const mensagemApi = obterMensagemErroApi(error);
        if (mensagemApi) {
            throw new Error(mensagemApi);
        }

        throw error;
    }
};

// Login (Firebase Auth)
export const realizarLogin = async (email, senha) => {
    const emailLimpo = normalizarEmail(email);

    if (!emailLimpo || !senha) {
        throw new Error('E-mail e senha são obrigatórios.');
    }

    if (!validarEmail(emailLimpo)) {
        throw new Error('E-mail inválido. Verifique o endereço informado.');
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailLimpo, senha);
        const user = userCredential.user;
        return user; 
    } catch (error) {
        throw new Error(
            mensagemErroAutenticacao(
                error,
                'Não foi possível fazer login. Tente novamente.'
            )
        );
    }
};

// Funções de Leitura de Dados 

// Busca o perfil usando o UID do usuário logado
export const getPerfil = (uid) => {
    return axios.get(`${API_BASE_URL}/pacientes/${uid}`);
};

// Busca o histórico de vacinas
export const getHistorico = (uid) => {
    return axios.get(`${API_BASE_URL}/historico/${uid}`);
};

// Busca as campanhas (público)
export const getCampanhas = () => {
    return axios.get(`${API_BASE_URL}/campanhas`);
};

// Busca detalhes de uma campanha específica
export const getCampanhaDetalhe = (id) => {
    return axios.get(`${API_BASE_URL}/campanhas/${id}`);
};

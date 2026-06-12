import axios from 'axios';
import { garantirFirebaseConfigurado } from './firebaseConfig';
import { 
    deleteUser,
    sendPasswordResetEmail, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import {
    obterCabecalhoAutenticacao,
    obterMensagemAcessoNegado
} from '../utilitarios/Seguranca';
import {
    obterMensagemFalhaTemporaria
} from '../utilitarios/Erros';
import { obterMensagemErroAutenticacao } from '../utilitarios/AuthMensagens';

// Se estiver testando localemnte, rode o backend localmente, use o IP da sua máquina (ex: 'http://192.168.1.15:3000')
const API_BASE_URL = 'https://b-health-app-api.onrender.com'; 
const API_TIMEOUT_MS = 65000;
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const obterAuth = () => garantirFirebaseConfigurado().auth;

const obterMensagemErroApi = (error) => {
    return error.response?.data?.error || error.response?.data?.message;
};

const executarRequisicaoPrivada = async (requisicao, fallback) => {
    try {
        const headers = await obterCabecalhoAutenticacao();
        return await requisicao(headers);
    } catch (error) {
        throw new Error(obterMensagemAcessoNegado(error, fallback));
    }
};

const normalizarEmail = (email) => String(email || '').trim().toLowerCase();

const validarEmail = (email) => emailRegex.test(normalizarEmail(email));

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
        await sendPasswordResetEmail(obterAuth(), emailLimpo);
        return true;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('E-mail não cadastrado.');
        }

        throw new Error(
            obterMensagemErroAutenticacao(
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
        const userCredential = await createUserWithEmailAndPassword(obterAuth(), dados.email, dados.senha);
        user = userCredential.user;
        await updateProfile(user, { displayName: dados.nome });
        await api.post('/pacientes', {
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
            const mensagemApi = obterMensagemErroApi(error) || obterMensagemFalhaTemporaria(
                error,
                'Não foi possível concluir o cadastro do paciente.'
            );

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

        throw new Error(
            obterMensagemFalhaTemporaria(
                error,
                'Não foi possível concluir o cadastro do paciente. Tente novamente.'
            )
        );
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
        const userCredential = await signInWithEmailAndPassword(obterAuth(), emailLimpo, senha);
        const user = userCredential.user;
        return user; 
    } catch (error) {
        throw new Error(
            obterMensagemErroAutenticacao(
                error,
                'Não foi possível fazer login. Tente novamente.'
            )
        );
    }
};

// Funções de Leitura de Dados 

// Busca o perfil usando o UID do usuário logado
export const getPerfil = (uid) => {
    return executarRequisicaoPrivada(
        (headers) => api.get(`/pacientes/${uid}`, { headers }),
        'Não foi possível carregar seu perfil. Tente novamente.'
    );
};

// Busca o histórico de vacinas
export const getHistorico = (uid) => {
    return executarRequisicaoPrivada(
        (headers) => api.get(`/historico/${uid}`, { headers }),
        'Não foi possível carregar seu histórico vacinal. Tente novamente.'
    );
};

// Busca as campanhas (público)
export const getCampanhas = ({ pagina = 1, limite = 20, busca, tipo_vacina } = {}) => {
    return api.get('/campanhas', {
        params: {
            pagina,
            limite,
            busca,
            tipo_vacina,
        },
    });
};

// Busca detalhes de uma campanha específica
export const getCampanhaDetalhe = (id) => {
    return api.get(`/campanhas/${id}`);
};

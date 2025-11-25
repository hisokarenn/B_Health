import axios from 'axios';
import { auth } from './firebaseConfig';
import { 
    sendPasswordResetEmail, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "firebase/auth";

import { updateProfile } from "firebase/auth"; //salvaer o nome do user

// 🚨 URL da sua API (Backend)
// Se estiver testando no celular físico, use o IP da sua máquina (ex: http://192.168.1.15:3000)
// Se já estiver com o backend no Render, use a URL do Render 'https://b-health-app-api.onrender.com'
const API_BASE_URL = 'https://b-health-app-api.onrender.com'; 

// --- FUNÇÃO 1: Recuperar Senha (Nativa do Firebase) ---
// Envia o e-mail de redefinição diretamente pelo Google
export const solicitarRecuperacaoSenha = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('E-mail não cadastrado.');
        }
        if (error.code === 'auth/invalid-email') {
            throw new Error('E-mail inválido.');
        }
        throw error;
    }
};

// --- FUNÇÃO 2: Cadastro Híbrido ---
// 1. Cria o usuário no sistema de Auth do Google
// 2. Envia os dados pessoais (CPF, CNS) para serem salvos no Firestore pelo seu Backend
export const cadastrarPaciente = async (dados) => {
    try {
        // A. Criação no Firebase Auth (Retorna o UID único)
        const userCredential = await createUserWithEmailAndPassword(auth, dados.email, dados.senha);
        const user = userCredential.user;

        await updateProfile(user, { displayName: dados.nome }); //aqui q tá o nome do user sendo salvo

        // B. Salvar dados no Banco de Dados (Via API)
        // Enviamos o UID gerado pelo Firebase para ser a chave do documento no banco
        await axios.post(`${API_BASE_URL}/pacientes`, {
            uid: user.uid, 
            nome: dados.nome,
            cpf: dados.cpf,
            cns: dados.cns,
            email: dados.email
        });

        return user;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está em uso.');
        }
        if (error.code === 'auth/weak-password') {
            throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        throw error;
    }
};

// --- FUNÇÃO 3: Login (Firebase Auth) ---
export const realizarLogin = async (email, senha) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        //await user.reload();
        
        // Retorna o objeto usuário (que contém o UID necessário para as próximas telas)
        return { user }; 
    } catch (error) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('E-mail ou senha incorretos.');
        }
        throw error;
    }
};

// --- Funções de Leitura de Dados (Via API Backend) ---

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

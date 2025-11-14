import axios from 'axios';

const API_BASE_URL='https://b-health-app-api.onrender.com';

// Cadastra usuário
export const cadastrarPaciente = (data) => {
    return axios.post(`${API_BASE_URL}/pacientes`, data);
};

// Autentica usuário
export const realizarLogin = (data) => {
    return axios.post(`${API_BASE_URL}/login`, data);
};

// Função para buscar histórico
export const getHistorico = (pacienteId) => {
    return axios.get(`${API_BASE_URL}/historico/${pacienteId}`);
};

// Função para buscar as campanhas
export const getCampanhas = () => {
    return axios.get(`${API_BASE_URL}/campanhas`);
};

// Função para visualizar/acessar perfil do usuário
export const getPerfil = (pacienteId) => {
    return axios.get(`${API_BASE_URL}/pacientes/${pacienteId}`);
};
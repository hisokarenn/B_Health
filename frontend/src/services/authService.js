import axios from 'axios';

//para testes locais use 'http://ip do computador:3000';
// substituir "ip do computador" pelo ip da sua maquina

// link do render para ter acesso ao server hospedado na nuvem 'https://b-health-app-api.onrender.com'

const API_BASE_URL='http://192.168.1.4:3000';

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

export const getCampanhaDetalhe = (id) => {
    return axios.get(`${API_BASE_URL}/campanhas/${id}`);
};

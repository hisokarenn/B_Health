// frontend/src/services/authService.js

import axios from 'axios';

// ATENÇÃO: Use o IP da sua máquina aqui!
const API_BASE_URL = 'http://192.168.1.5:3000';

//Cadastra
export const cadastrarPaciente = (data) => {
    return axios.post(`${API_BASE_URL}/pacientes`, data);
};

//Autentica
export const realizarLogin = (data) => {
    return axios.post(`${API_BASE_URL}/login`, data);
};

// Função para buscar histórico
export const getHistorico = (pacienteId) => {
    return axios.get(`${API_BASE_URL}/historico/${pacienteId}`);
};

// Função para buscar as campanhas (RF04)
export const getCampanhas = () => {
    return axios.get(`${API_BASE_URL}/campanhas`);
};


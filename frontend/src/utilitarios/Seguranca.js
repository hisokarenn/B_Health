import * as SecureStore from 'expo-secure-store';
import { auth } from '../services/firebaseConfig';

export async function salvarCredenciais(email, senha) {
  try {
    await SecureStore.setItemAsync('login_email', email);
    await SecureStore.setItemAsync('login_senha', senha);
    return true;
  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
    throw new Error('Não foi possível salvar suas credenciais neste dispositivo.');
  }
}

export async function obterCredenciais() {
  try {
    const email = await SecureStore.getItemAsync('login_email');
    const senha = await SecureStore.getItemAsync('login_senha');

    if (!email || !senha) return null;

    return { email, senha };
  } catch (error) {
    console.error("Erro ao obter credenciais:", error);
    throw new Error('Não foi possível recuperar as credenciais salvas neste dispositivo.');
  }
}

export async function limparCredenciais() {
  try {
    await SecureStore.deleteItemAsync('login_email');
    await SecureStore.deleteItemAsync('login_senha');
    return true;
  } catch (error) {
    console.error("Erro ao limpar credenciais:", error);
    throw new Error('Não foi possível limpar as credenciais salvas neste dispositivo.');
  }
}

export async function obterTokenAutenticacao() {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error('Faça login para acessar esta informação.');
  }

  try {
    return await usuario.getIdToken();
  } catch (error) {
    console.error("Erro ao obter token de autenticação:", error);
    throw new Error('Não foi possível validar sua sessão. Faça login novamente.');
  }
}

export async function obterCabecalhoAutenticacao() {
  const token = await obterTokenAutenticacao();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function obterMensagemAcessoNegado(error, fallback) {
  const status = error.response?.status;
  const mensagemApi = error.response?.data?.error || error.response?.data?.message;

  if (status === 401) {
    return mensagemApi || 'Sua sessão expirou. Faça login novamente para continuar.';
  }

  if (status === 403) {
    return mensagemApi || 'Você não tem permissão para acessar essas informações.';
  }

  if (mensagemApi) {
    return mensagemApi;
  }

  return error.message || fallback || 'Não foi possível acessar as informações solicitadas.';
}

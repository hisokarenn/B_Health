import * as SecureStore from 'expo-secure-store';

export async function salvarCredenciais(email, senha) {
  try {
    await SecureStore.setItemAsync('login_email', email);
    await SecureStore.setItemAsync('login_senha', senha);
  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
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
    return null;
  }
}

export async function limparCredenciais() {
  try {
    await SecureStore.deleteItemAsync('login_email');
    await SecureStore.deleteItemAsync('login_senha');
  } catch (error) {
    console.error("Erro ao limpar credenciais:", error);
  }
}
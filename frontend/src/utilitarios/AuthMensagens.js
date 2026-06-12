import {
  ehErroSemConexao,
  obterMensagemFalhaTemporaria,
} from './Erros.js';

export const obterMensagemErroAutenticacao = (
  error,
  fallback = 'Não foi possível fazer login. Tente novamente.'
) => {
  if (ehErroSemConexao(error)) {
    return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
  }

  if (
    error?.code === 'auth/invalid-credential'
    || error?.code === 'auth/user-not-found'
    || error?.code === 'auth/wrong-password'
  ) {
    return 'E-mail ou senha incorretos.';
  }

  if (error?.code === 'auth/invalid-email') {
    return 'E-mail inválido. Verifique o endereço informado.';
  }

  if (error?.code === 'auth/too-many-requests') {
    return 'Muitas tentativas em sequência. Aguarde alguns minutos e tente novamente.';
  }

  return obterMensagemFalhaTemporaria(error, fallback);
};

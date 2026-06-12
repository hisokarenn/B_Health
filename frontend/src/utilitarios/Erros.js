const CODIGOS_FALHA_TEMPORARIA = new Set([
  'aborted',
  'cancelled',
  'data-loss',
  'deadline-exceeded',
  'internal',
  'resource-exhausted',
  'unavailable',
]);

const CODIGOS_CONEXAO = new Set([
  'auth/network-request-failed',
  'econnaborted',
  'network_error',
]);

const normalizar = (valor) => String(valor || '').trim().toLowerCase();

const obterCodigoErro = (error) => normalizar(error?.code || error?.name);

const obterMensagemApi = (error) => (
  error?.response?.data?.error || error?.response?.data?.message || ''
);

export const ehErroSemConexao = (error) => {
  const codigo = obterCodigoErro(error);
  const mensagem = normalizar(error?.message);

  return CODIGOS_CONEXAO.has(codigo)
    || mensagem.includes('network')
    || mensagem.includes('offline')
    || mensagem.includes('sem conexao')
    || mensagem.includes('sem conexão');
};

export const obterMensagemFalhaTemporaria = (
  error,
  fallback = 'Não foi possível concluir a operação. Tente novamente.'
) => {
  const status = error?.response?.status;
  const codigo = obterCodigoErro(error);
  const mensagemApi = obterMensagemApi(error);
  const mensagemOriginal = String(error?.message || '').trim();

  if (mensagemOriginal.startsWith('Configuração do Firebase')) {
    return mensagemOriginal;
  }

  if (ehErroSemConexao(error)) {
    return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
  }

  if (status === 401) {
    return mensagemApi || 'Sua sessão expirou. Faça login novamente para continuar.';
  }

  if (status === 403 || codigo === 'permission-denied') {
    return mensagemApi || 'Você não tem permissão para acessar essas informações.';
  }

  if (status === 404) {
    return mensagemApi || 'As informações solicitadas não foram encontradas.';
  }

  if (status === 429 || codigo === 'resource-exhausted') {
    return mensagemApi || 'Muitas solicitações em sequência. Aguarde alguns instantes e tente novamente.';
  }

  if ([500, 502, 503, 504].includes(status) || CODIGOS_FALHA_TEMPORARIA.has(codigo)) {
    return mensagemApi || 'O serviço está temporariamente indisponível. Tente novamente em instantes.';
  }

  if (mensagemApi) {
    return mensagemApi;
  }

  return mensagemOriginal || fallback;
};

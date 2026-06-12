export const somenteDigitos = (value) => String(value || '').replace(/\D/g, '');
export const textoLimpo = (value) => String(value || '').trim();
export const emailGmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

export const formatarCpf = (value) => (
  value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
);

export const formatarCns = (value) => (
  value.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
);

export const normalizarDadosPaciente = (dados = {}) => {
  const uidLimpo = textoLimpo(dados.uid);
  const nomeLimpo = textoLimpo(dados.nome);
  const cpfLimpo = textoLimpo(dados.cpf);
  const cnsLimpo = textoLimpo(dados.cns);
  const emailLimpo = textoLimpo(dados.email).toLowerCase();
  const cpfNumeros = somenteDigitos(cpfLimpo);
  const cnsNumeros = somenteDigitos(cnsLimpo);

  return {
    uidLimpo,
    nomeLimpo,
    cpfLimpo,
    cnsLimpo,
    emailLimpo,
    cpfNumeros,
    cnsNumeros,
    cpfFormatado: cpfNumeros.length === 11 ? formatarCpf(cpfNumeros) : '',
    cnsFormatado: cnsNumeros.length === 15 ? formatarCns(cnsNumeros) : '',
  };
};

export const validarDadosPaciente = (dados = {}) => {
  const normalizado = normalizarDadosPaciente(dados);

  if (
    !normalizado.uidLimpo
    || !normalizado.nomeLimpo
    || !normalizado.cpfNumeros
    || !normalizado.cnsNumeros
    || !normalizado.emailLimpo
  ) {
    return {
      ok: false,
      status: 400,
      error: 'Todos os campos são obrigatórios',
      dados: normalizado,
    };
  }

  if (!emailGmailRegex.test(normalizado.emailLimpo)) {
    return {
      ok: false,
      status: 400,
      error: 'Use um e-mail válido do domínio @gmail.com.',
      dados: normalizado,
    };
  }

  if (normalizado.cpfNumeros.length !== 11) {
    return {
      ok: false,
      status: 400,
      error: 'O CPF deve conter 11 dígitos.',
      dados: normalizado,
    };
  }

  if (normalizado.cnsNumeros.length !== 15) {
    return {
      ok: false,
      status: 400,
      error: 'O CNS deve conter 15 dígitos.',
      dados: normalizado,
    };
  }

  return {
    ok: true,
    dados: normalizado,
  };
};

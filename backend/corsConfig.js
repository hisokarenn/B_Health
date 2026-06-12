const ORIGENS_DESENVOLVIMENTO = [
  'http://localhost:19006',
  'http://localhost:8081',
  'http://localhost:3000',
  'http://127.0.0.1:19006',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:3000',
];

const normalizarOrigem = (origin) => String(origin || '').trim().replace(/\/$/, '');

const separarOrigens = (valor) => String(valor || '')
  .split(',')
  .map(normalizarOrigem)
  .filter(Boolean);

export const obterOrigensPermitidas = (env = process.env) => {
  const origensConfiguradas = separarOrigens(env.CORS_ALLOWED_ORIGINS);

  if (origensConfiguradas.length) {
    return origensConfiguradas;
  }

  if (env.NODE_ENV === 'production') {
    return [];
  }

  return ORIGENS_DESENVOLVIMENTO;
};

export const criarCorsOptions = (env = process.env) => {
  const origensPermitidas = obterOrigensPermitidas(env);

  return {
    optionsSuccessStatus: 204,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (origensPermitidas.includes(normalizarOrigem(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error('Origem não autorizada pelo CORS.'), false);
    },
  };
};

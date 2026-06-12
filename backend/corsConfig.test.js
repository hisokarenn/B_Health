import test from 'node:test';
import assert from 'node:assert/strict';
import { criarCorsOptions, obterOrigensPermitidas } from './corsConfig.js';

const validarOrigem = (options, origin) => new Promise((resolve) => {
  options.origin(origin, (error, permitido) => {
    resolve({ error, permitido });
  });
});

test('usa origens configuradas por ambiente quando CORS_ALLOWED_ORIGINS existe', () => {
  assert.deepEqual(
    obterOrigensPermitidas({
      NODE_ENV: 'production',
      CORS_ALLOWED_ORIGINS: 'https://app.exemplo.com, http://localhost:19006/',
    }),
    ['https://app.exemplo.com', 'http://localhost:19006']
  );
});

test('bloqueia origem externa nao autorizada', async () => {
  const options = criarCorsOptions({
    NODE_ENV: 'production',
    CORS_ALLOWED_ORIGINS: 'https://app.exemplo.com',
  });

  const resultado = await validarOrigem(options, 'https://externo.exemplo.com');

  assert.equal(resultado.permitido, false);
  assert.equal(resultado.error.message, 'Origem não autorizada pelo CORS.');
});

test('permite requisicoes sem Origin para clientes mobile, scripts e health checks', async () => {
  const options = criarCorsOptions({
    NODE_ENV: 'production',
    CORS_ALLOWED_ORIGINS: 'https://app.exemplo.com',
  });

  const resultado = await validarOrigem(options);

  assert.equal(resultado.error, null);
  assert.equal(resultado.permitido, true);
});

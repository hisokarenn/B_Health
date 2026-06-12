import test from 'node:test';
import assert from 'node:assert/strict';
import {
  avaliarAcessoMesmoPaciente,
  obterTokenBearer,
} from './authRules.js';

test('extrai token bearer valido', () => {
  assert.equal(obterTokenBearer('Bearer token-123'), 'token-123');
  assert.equal(obterTokenBearer('bearer token-456'), 'token-456');
});

test('rejeita authorization ausente ou sem bearer', () => {
  assert.equal(obterTokenBearer(''), null);
  assert.equal(obterTokenBearer('Basic abc'), null);
  assert.equal(obterTokenBearer('Bearer'), null);
});

test('bloqueia rota protegida sem usuario autenticado', () => {
  const resultado = avaliarAcessoMesmoPaciente({
    uidSolicitado: 'paciente-1',
    uidAutenticado: '',
  });

  assert.deepEqual(resultado, {
    permitido: false,
    status: 401,
    error: 'Autenticação necessária para acessar este recurso.',
  });
});

test('bloqueia paciente tentando acessar outro UID', () => {
  const resultado = avaliarAcessoMesmoPaciente({
    uidSolicitado: 'paciente-1',
    uidAutenticado: 'paciente-2',
  });

  assert.deepEqual(resultado, {
    permitido: false,
    status: 403,
    error: 'Você não tem permissão para acessar dados de outro paciente.',
  });
});

test('permite paciente acessando o proprio UID', () => {
  assert.deepEqual(
    avaliarAcessoMesmoPaciente({
      uidSolicitado: ' paciente-1 ',
      uidAutenticado: 'paciente-1',
    }),
    {
      permitido: true,
      uid: 'paciente-1',
    }
  );
});

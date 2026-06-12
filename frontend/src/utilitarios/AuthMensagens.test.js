import test from 'node:test';
import assert from 'node:assert/strict';
import { obterMensagemErroAutenticacao } from './AuthMensagens.js';

test('traduz credencial invalida para mensagem amigavel de login', () => {
  assert.equal(
    obterMensagemErroAutenticacao({ code: 'auth/invalid-credential' }),
    'E-mail ou senha incorretos.'
  );
});

test('traduz falha de rede no login', () => {
  assert.equal(
    obterMensagemErroAutenticacao({ code: 'auth/network-request-failed' }),
    'Sem conexão com a internet. Verifique sua conexão e tente novamente.'
  );
});

test('traduz excesso de tentativas no login', () => {
  assert.equal(
    obterMensagemErroAutenticacao({ code: 'auth/too-many-requests' }),
    'Muitas tentativas em sequência. Aguarde alguns minutos e tente novamente.'
  );
});

test('usa fallback recuperavel para falha temporaria do servico', () => {
  assert.equal(
    obterMensagemErroAutenticacao({ code: 'unavailable' }),
    'O serviço está temporariamente indisponível. Tente novamente em instantes.'
  );
});

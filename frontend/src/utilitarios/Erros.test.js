import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ehErroSemConexao,
  obterMensagemFalhaTemporaria,
} from './Erros.js';

test('identifica erro sem conexao por codigo e mensagem', () => {
  assert.equal(ehErroSemConexao({ code: 'auth/network-request-failed' }), true);
  assert.equal(ehErroSemConexao({ message: 'Network request failed' }), true);
});

test('retorna mensagem amigavel para acesso negado', () => {
  assert.equal(
    obterMensagemFalhaTemporaria({ response: { status: 403 } }),
    'Você não tem permissão para acessar essas informações.'
  );
});

test('retorna mensagem amigavel para falha temporaria do backend', () => {
  assert.equal(
    obterMensagemFalhaTemporaria({ response: { status: 503 } }),
    'O serviço está temporariamente indisponível. Tente novamente em instantes.'
  );
});

test('preserva mensagem de configuracao do Firebase', () => {
  const mensagem = 'Configuração do Firebase ausente. Crie frontend/.env.';

  assert.equal(
    obterMensagemFalhaTemporaria({ message: mensagem }),
    mensagem
  );
});

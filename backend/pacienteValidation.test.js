import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizarDadosPaciente,
  validarDadosPaciente,
} from './pacienteValidation.js';

const pacienteValido = {
  uid: 'uid-paciente-1',
  nome: 'Maria Silva',
  cpf: '123.456.789-01',
  cns: '123 4567 8901 2345',
  email: 'MARIA@gmail.com',
};

test('bloqueia cadastro com campo obrigatorio vazio', () => {
  const resultado = validarDadosPaciente({
    ...pacienteValido,
    nome: '',
  });

  assert.equal(resultado.ok, false);
  assert.equal(resultado.status, 400);
  assert.equal(resultado.error, 'Todos os campos são obrigatórios');
});

test('bloqueia cadastro com e-mail fora do dominio gmail.com', () => {
  const resultado = validarDadosPaciente({
    ...pacienteValido,
    email: 'maria@example.com',
  });

  assert.equal(resultado.ok, false);
  assert.equal(resultado.status, 400);
  assert.equal(resultado.error, 'Use um e-mail válido do domínio @gmail.com.');
});

test('bloqueia cadastro com CPF menor que 11 digitos', () => {
  const resultado = validarDadosPaciente({
    ...pacienteValido,
    cpf: '123.456.789-0',
  });

  assert.equal(resultado.ok, false);
  assert.equal(resultado.status, 400);
  assert.equal(resultado.error, 'O CPF deve conter 11 dígitos.');
});

test('bloqueia cadastro com CNS menor que 15 digitos', () => {
  const resultado = validarDadosPaciente({
    ...pacienteValido,
    cns: '123 4567 8901 234',
  });

  assert.equal(resultado.ok, false);
  assert.equal(resultado.status, 400);
  assert.equal(resultado.error, 'O CNS deve conter 15 dígitos.');
});

test('normaliza dados validos para persistencia no backend', () => {
  const resultado = validarDadosPaciente(pacienteValido);

  assert.equal(resultado.ok, true);
  assert.equal(resultado.dados.emailLimpo, 'maria@gmail.com');
  assert.equal(resultado.dados.cpfNumeros, '12345678901');
  assert.equal(resultado.dados.cnsNumeros, '123456789012345');
  assert.equal(resultado.dados.cpfFormatado, '123.456.789-01');
  assert.equal(resultado.dados.cnsFormatado, '123 4567 8901 2345');
});

test('normalizacao preserva fallback vazio sem lancar excecao', () => {
  assert.deepEqual(
    normalizarDadosPaciente(),
    {
      uidLimpo: '',
      nomeLimpo: '',
      cpfLimpo: '',
      cnsLimpo: '',
      emailLimpo: '',
      cpfNumeros: '',
      cnsNumeros: '',
      cpfFormatado: '',
      cnsFormatado: '',
    }
  );
});

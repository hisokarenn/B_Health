import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CAMPANHAS_LIMIT,
  criarCampanhasCache,
  listarCampanhas,
  normalizarParametrosCampanhas,
} from './campanhasService.js';

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const criarDbFake = ({ docs = [], fail = false, delayMs = 0 } = {}) => {
  let chamadas = 0;

  return {
    get chamadas() {
      return chamadas;
    },
    collection(nome) {
      assert.equal(nome, 'campanhas');

      return {
        async get() {
          chamadas += 1;
          if (delayMs) await delay(delayMs);
          if (fail) throw new Error('Firestore indisponivel');

          return {
            empty: docs.length === 0,
            docs: docs.map((data, index) => ({
              id: data.id || `campanha-${index}`,
              data: () => data,
            })),
          };
        },
      };
    },
  };
};

const criarCampanhas = (quantidade) => Array.from({ length: quantidade }, (_, index) => ({
  id: `campanha-${index + 1}`,
  titulo: `Campanha ${index + 1}`,
  tipo_vacina: index % 2 === 0 ? 'Influenza' : 'Covid',
  unidade_saude_nome: 'UBS Central',
}));

test('normaliza pagina e limita o tamanho maximo da pagina', () => {
  assert.deepEqual(
    normalizarParametrosCampanhas({ pagina: '-2', limite: '999' }),
    {
      pagina: 1,
      limite: MAX_CAMPANHAS_LIMIT,
      busca: '',
      tipoVacina: '',
    }
  );
});

test('pagina campanhas com metadados para o frontend carregar mais itens', async () => {
  const db = criarDbFake({ docs: criarCampanhas(45) });
  const cache = criarCampanhasCache();

  const resultado = await listarCampanhas({
    db,
    cache,
    query: { pagina: '2', limite: '20' },
  });

  assert.equal(resultado.campanhas.length, 20);
  assert.equal(resultado.paginacao.total, 45);
  assert.equal(resultado.paginacao.pagina, 2);
  assert.equal(resultado.paginacao.proximaPagina, 3);
});

test('usa cache para reduzir leituras repetidas no Firestore', async () => {
  const db = criarDbFake({ docs: criarCampanhas(5) });
  const cache = criarCampanhasCache({ ttlMs: 60_000 });

  await listarCampanhas({ db, cache, now: () => 1_000 });
  await listarCampanhas({ db, cache, now: () => 2_000 });

  assert.equal(db.chamadas, 1);
});

test('compartilha a mesma leitura quando muitos acessos chegam simultaneamente', async () => {
  const db = criarDbFake({ docs: criarCampanhas(25), delayMs: 10 });
  const cache = criarCampanhasCache({ ttlMs: 60_000 });
  const requisicoes = Array.from({ length: 40 }, () => (
    listarCampanhas({
      db,
      cache,
      query: { pagina: '1', limite: '10' },
      now: () => 1_000,
    })
  ));

  const resultados = await Promise.all(requisicoes);

  assert.equal(db.chamadas, 1);
  assert.equal(resultados.length, 40);
  assert.ok(resultados.every((resultado) => resultado.campanhas.length === 10));
});

test('propaga falha do Firestore para a rota responder com mensagem amigavel', async () => {
  const db = criarDbFake({ fail: true });
  const cache = criarCampanhasCache();

  await assert.rejects(
    listarCampanhas({ db, cache }),
    /Firestore indisponivel/
  );
});

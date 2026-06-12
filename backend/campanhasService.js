export const DEFAULT_CAMPANHAS_LIMIT = 20;
export const MAX_CAMPANHAS_LIMIT = 50;
export const DEFAULT_CAMPANHAS_CACHE_TTL_MS = 60 * 1000;

const textoLimpo = (valor) => String(valor || '').trim();

const normalizarBusca = (valor) => textoLimpo(valor)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const inteiroPositivo = (valor, fallback) => {
  const numero = Number.parseInt(valor, 10);
  return Number.isFinite(numero) && numero > 0 ? numero : fallback;
};

export const normalizarParametrosCampanhas = (query = {}) => {
  const pagina = inteiroPositivo(query.pagina || query.page, 1);
  const limiteSolicitado = inteiroPositivo(query.limite || query.limit, DEFAULT_CAMPANHAS_LIMIT);
  const limite = Math.min(limiteSolicitado, MAX_CAMPANHAS_LIMIT);

  return {
    pagina,
    limite,
    busca: textoLimpo(query.busca || query.q),
    tipoVacina: textoLimpo(query.tipo_vacina || query.tipo),
  };
};

export const criarCampanhasCache = ({ ttlMs = DEFAULT_CAMPANHAS_CACHE_TTL_MS } = {}) => ({
  data: null,
  expiresAt: 0,
  pending: null,
  ttlMs,
});

export const buscarCampanhasFirestore = async (db) => {
  const snapshot = await db.collection('campanhas').get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const obterCampanhasComCache = async ({ db, cache, now = Date.now }) => {
  const agora = now();

  if (cache.data && cache.expiresAt > agora) {
    return { campanhas: cache.data, origem: 'cache' };
  }

  if (cache.pending) {
    return { campanhas: await cache.pending, origem: 'pending' };
  }

  cache.pending = buscarCampanhasFirestore(db)
    .then((campanhas) => {
      cache.data = campanhas;
      cache.expiresAt = now() + cache.ttlMs;
      return campanhas;
    })
    .finally(() => {
      cache.pending = null;
    });

  return { campanhas: await cache.pending, origem: 'firestore' };
};

const campanhaAtendeFiltros = (campanha, { busca, tipoVacina }) => {
  const buscaNormalizada = normalizarBusca(busca);
  const tipoNormalizado = normalizarBusca(tipoVacina);

  if (tipoNormalizado && normalizarBusca(campanha.tipo_vacina) !== tipoNormalizado) {
    return false;
  }

  if (!buscaNormalizada) {
    return true;
  }

  const camposBusca = [
    campanha.titulo,
    campanha.nome,
    campanha.tipo_vacina,
    campanha.unidade_saude_nome,
    campanha.locais_aplicacao,
  ];

  return camposBusca.some((campo) => normalizarBusca(campo).includes(buscaNormalizada));
};

const paginarCampanhas = (campanhas, { pagina, limite }) => {
  const total = campanhas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / limite));
  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite;

  return {
    campanhas: campanhas.slice(inicio, fim),
    paginacao: {
      pagina,
      limite,
      total,
      totalPaginas,
      proximaPagina: pagina < totalPaginas ? pagina + 1 : null,
    },
  };
};

export const listarCampanhas = async ({ db, query = {}, cache, now = Date.now }) => {
  const parametros = normalizarParametrosCampanhas(query);
  const cacheCampanhas = cache || criarCampanhasCache();
  const { campanhas, origem } = await obterCampanhasComCache({
    db,
    cache: cacheCampanhas,
    now,
  });
  const campanhasFiltradas = campanhas.filter((campanha) => (
    campanhaAtendeFiltros(campanha, parametros)
  ));
  const resultado = paginarCampanhas(campanhasFiltradas, parametros);

  return {
    message: campanhasFiltradas.length === 0
      ? 'Nenhuma campanha ativa no momento.'
      : undefined,
    campanhas: resultado.campanhas,
    paginacao: resultado.paginacao,
    filtros: {
      busca: parametros.busca || undefined,
      tipo_vacina: parametros.tipoVacina || undefined,
    },
    cache: {
      origem,
      ttlMs: cacheCampanhas.ttlMs,
    },
  };
};

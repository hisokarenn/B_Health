import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { garantirFirebaseConfigurado } from '../services/firebaseConfig';

const CHAVE_LOCAL = '@notificacoes_lidas';
const DIAS_PARA_REMOVER = 5;
const PRAZO_EXIBICAO_MS = DIAS_PARA_REMOVER * 24 * 60 * 60 * 1000;

const obterFirebase = () => garantirFirebaseConfigurado();

export const obterCampanhaId = (campanha) => (
  String(campanha?.id || campanha?.id_campanha || campanha?.uid || '')
);

// Lê o mapa { idCampanha: timestampDeLeitura(ms) }.
// Mantém compatibilidade com o formato legado (array de ids), tratando-os
// como lidos "agora" para que ainda respeitem os 5 dias de exibição.
const lerRegistrosLeitura = async () => {
  const valor = await AsyncStorage.getItem(CHAVE_LOCAL);
  if (!valor) return {};

  try {
    const dados = JSON.parse(valor);

    if (Array.isArray(dados)) {
      const agora = Date.now();
      return dados.reduce((acc, id) => {
        const chave = String(id ?? '');
        if (chave) acc[chave] = agora;
        return acc;
      }, {});
    }

    if (dados && typeof dados === 'object') {
      return Object.entries(dados).reduce((acc, [id, timestamp]) => {
        const chave = String(id ?? '');
        const data = Number(timestamp);
        if (chave && Number.isFinite(data)) acc[chave] = data;
        return acc;
      }, {});
    }

    return {};
  } catch (error) {
    console.error('Erro ao ler notificações salvas localmente:', error);
    return {};
  }
};

const salvarRegistrosLeitura = async (registros) => {
  await AsyncStorage.setItem(CHAVE_LOCAL, JSON.stringify(registros));
};

// Registra a data de leitura apenas para ids ainda não marcados,
// preservando a data original (e portanto a contagem dos 5 dias).
const registrarLeituras = (registros, ids, agora = Date.now()) => {
  let mudou = false;
  const atualizados = { ...registros };

  (Array.isArray(ids) ? ids : [])
    .map((id) => String(id ?? ''))
    .filter((id) => id && atualizados[id] === undefined)
    .forEach((id) => {
      atualizados[id] = agora;
      mudou = true;
    });

  return { registros: atualizados, mudou };
};

export const obterIdsNotificacoesLidas = async () => (
  Object.keys(await lerRegistrosLeitura())
);

export const marcarNotificacaoComoLida = async (campanhaId) => {
  const id = String(campanhaId || '');

  if (!id) {
    throw new Error('Não foi possível identificar a campanha selecionada.');
  }

  const registros = await lerRegistrosLeitura();
  const { registros: atualizados, mudou } = registrarLeituras(registros, [id]);
  if (mudou) await salvarRegistrosLeitura(atualizados);

  return { sincronizado: true, mensagem: '' };
};

export const marcarNotificacoesComoLidas = async (ids) => {
  const registros = await lerRegistrosLeitura();
  const { registros: atualizados, mudou } = registrarLeituras(registros, ids);
  if (mudou) await salvarRegistrosLeitura(atualizados);

  return { sincronizado: true, mensagem: '' };
};

// Busca as campanhas no Firestore junto com os registros de leitura,
// descartando registros de campanhas que não existem mais.
const carregarCampanhasComLeitura = async () => {
  const [snapshot, registros] = await Promise.all([
    getDocs(collection(obterFirebase().db, 'campanhas')),
    lerRegistrosLeitura(),
  ]);

  const campanhas = snapshot.docs.map((documento) => (
    { id: documento.id, ...documento.data() }
  ));

  const idsExistentes = new Set(campanhas.map(obterCampanhaId));
  const registrosLimpos = Object.fromEntries(
    Object.entries(registros).filter(([id]) => idsExistentes.has(id))
  );

  if (Object.keys(registrosLimpos).length !== Object.keys(registros).length) {
    await salvarRegistrosLeitura(registrosLimpos);
  }

  return { campanhas, registros: registrosLimpos };
};

// Campanhas exibidas na tela: nunca lidas OU lidas há menos de 5 dias.
// A leitura não remove a notificação imediatamente; ela só sai da lista
// depois de PRAZO_EXIBICAO_MS desde a data da leitura.
export const buscarCampanhasNaoLidas = async () => {
  const { campanhas, registros } = await carregarCampanhasComLeitura();
  const agora = Date.now();

  return campanhas.filter((campanha) => {
    const lidaEm = registros[obterCampanhaId(campanha)];
    if (lidaEm === undefined) return true;
    return agora - lidaEm < PRAZO_EXIBICAO_MS;
  });
};

// O badge (pontinho verde) considera apenas campanhas realmente não lidas.
export const existemNotificacoesNaoLidas = async () => {
  const { campanhas, registros } = await carregarCampanhasComLeitura();
  return campanhas.some(
    (campanha) => registros[obterCampanhaId(campanha)] === undefined
  );
};

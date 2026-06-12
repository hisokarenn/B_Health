import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { garantirFirebaseConfigurado } from '../services/firebaseConfig';

const CHAVE_LOCAL = '@notificacoes_lidas';

const normalizarIds = (ids) => (
  [...new Set((Array.isArray(ids) ? ids : [])
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map((id) => String(id)))]
);

const obterFirebase = () => garantirFirebaseConfigurado();

export const obterCampanhaId = (campanha) => (
  String(campanha?.id || campanha?.id_campanha || campanha?.uid || '')
);

const lerIdsLidas = async () => {
  const valor = await AsyncStorage.getItem(CHAVE_LOCAL);
  if (!valor) return [];

  try {
    return normalizarIds(JSON.parse(valor));
  } catch (error) {
    console.error('Erro ao ler notificações salvas localmente:', error);
    return [];
  }
};

export const obterIdsNotificacoesLidas = async () => lerIdsLidas();

export const marcarNotificacaoComoLida = async (campanhaId) => {
  const id = String(campanhaId || '');

  if (!id) {
    throw new Error('Não foi possível identificar a campanha selecionada.');
  }

  const idsAtuais = await lerIdsLidas();

  if (!idsAtuais.includes(id)) {
    await AsyncStorage.setItem(
      CHAVE_LOCAL,
      JSON.stringify(normalizarIds([...idsAtuais, id]))
    );
  }

  return { sincronizado: true, mensagem: '' };
};

export const buscarCampanhasNaoLidas = async () => {
  const [snapshot, idsLidas] = await Promise.all([
    getDocs(collection(obterFirebase().db, 'campanhas')),
    lerIdsLidas(),
  ]);

  const idsLidasSet = new Set(idsLidas);

  return snapshot.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .filter((campanha) => !idsLidasSet.has(obterCampanhaId(campanha)));
};

export const existemNotificacoesNaoLidas = async () => {
  const notificacoes = await buscarCampanhasNaoLidas();
  return notificacoes.length > 0;
};

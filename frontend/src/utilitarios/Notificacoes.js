import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { garantirFirebaseConfigurado } from '../services/firebaseConfig';

const CHAVE_LOCAL_BASE = '@notificacoes_lidas';
const COLECAO_LEITURAS = 'usuarios_notificacoes_lidas';

const normalizarIds = (ids) => (
  [...new Set((Array.isArray(ids) ? ids : [])
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map((id) => String(id)))]
);

const obterFirebase = () => garantirFirebaseConfigurado();

const obterUid = (uid) => uid || obterFirebase().auth.currentUser?.uid || null;

const obterChaveLocal = (uid) => `${CHAVE_LOCAL_BASE}:${uid || 'anonimo'}`;

const lerArrayJson = async (chave) => {
  const valor = await AsyncStorage.getItem(chave);
  if (!valor) return [];

  try {
    return normalizarIds(JSON.parse(valor));
  } catch (error) {
    console.error('Erro ao ler notificações salvas localmente:', error);
    return [];
  }
};

const salvarIdsLocalmente = async (uid, ids) => {
  await AsyncStorage.setItem(
    obterChaveLocal(uid),
    JSON.stringify(normalizarIds(ids))
  );
};

export const obterCampanhaId = (campanha) => (
  String(campanha?.id || campanha?.id_campanha || campanha?.uid || '')
);

export const obterIdsNotificacoesLidas = async (uid) => {
  const uidUsuario = obterUid(uid);
  const idsLocais = normalizarIds([
    ...(await lerArrayJson(obterChaveLocal(uidUsuario))),
    ...(await lerArrayJson(CHAVE_LOCAL_BASE)),
  ]);

  if (!uidUsuario) {
    return idsLocais;
  }

  try {
    const leituraDoc = await getDoc(doc(obterFirebase().db, COLECAO_LEITURAS, uidUsuario));
    const dados = leituraDoc.exists() ? leituraDoc.data() : {};
    const idsRemotos = normalizarIds(dados.campanhaIds || dados.idsLidas);
    const idsMesclados = normalizarIds([...idsLocais, ...idsRemotos]);

    await salvarIdsLocalmente(uidUsuario, idsMesclados);
    return idsMesclados;
  } catch (error) {
    console.error('Erro ao sincronizar notificações lidas:', error);
    return idsLocais;
  }
};

export const marcarNotificacaoComoLida = async (campanhaId, uid) => {
  const uidUsuario = obterUid(uid);
  const id = String(campanhaId || '');

  if (!id) {
    throw new Error('Não foi possível identificar a campanha selecionada.');
  }

  const idsLocais = await obterIdsNotificacoesLidas(uidUsuario);
  const idsAtualizados = normalizarIds([...idsLocais, id]);
  await salvarIdsLocalmente(uidUsuario, idsAtualizados);

  if (!uidUsuario) {
    return {
      sincronizado: false,
      mensagem: 'A leitura foi salva neste dispositivo, mas não foi sincronizada porque a sessão não foi identificada.',
    };
  }

  try {
    await setDoc(
      doc(obterFirebase().db, COLECAO_LEITURAS, uidUsuario),
      {
        campanhaIds: arrayUnion(id),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { sincronizado: true, mensagem: '' };
  } catch (error) {
    console.error('Erro ao salvar notificação lida no Firestore:', error);
    return {
      sincronizado: false,
      mensagem: 'A leitura foi salva neste dispositivo, mas não foi possível sincronizar com outros dispositivos agora.',
    };
  }
};

export const buscarCampanhasNaoLidas = async (uid) => {
  const [snapshot, idsLidas] = await Promise.all([
    getDocs(collection(obterFirebase().db, 'campanhas')),
    obterIdsNotificacoesLidas(uid),
  ]);

  const idsLidasSet = new Set(idsLidas);

  return snapshot.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .filter((campanha) => !idsLidasSet.has(obterCampanhaId(campanha)));
};

export const existemNotificacoesNaoLidas = async (uid) => {
  const notificacoes = await buscarCampanhasNaoLidas(uid);
  return notificacoes.length > 0;
};

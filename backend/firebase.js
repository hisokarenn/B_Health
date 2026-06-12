import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const textoLimpo = (valor) => String(valor || '').trim();

const resolverCaminhoCredencial = (caminho) => {
  const caminhoLimpo = textoLimpo(caminho);
  if (!caminhoLimpo) return path.resolve(__dirname, 'serviceAccountKey.json');
  return path.isAbsolute(caminhoLimpo)
    ? caminhoLimpo
    : path.resolve(__dirname, caminhoLimpo);
};

const criarErroConfiguracao = () => new Error(
  'Configuração do Firebase Admin ausente. Forneça backend/serviceAccountKey.json em desenvolvimento, ' +
  'FIREBASE_SERVICE_ACCOUNT_JSON com o JSON completo da conta de serviço, ou GOOGLE_APPLICATION_CREDENTIALS apontando para um arquivo válido.'
);

const carregarServiceAccountJson = () => {
  const serviceAccountJson = textoLimpo(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  if (!serviceAccountJson) {
    return null;
  }

  try {
    return JSON.parse(serviceAccountJson);
  } catch (error) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não é um JSON válido. Verifique a variável de ambiente antes de iniciar o backend.');
  }
};

const obterCredencialFirebase = () => {
  const serviceAccountEnv = carregarServiceAccountJson();
  if (serviceAccountEnv) {
    return {
      credential: admin.credential.cert(serviceAccountEnv),
      origem: 'FIREBASE_SERVICE_ACCOUNT_JSON',
    };
  }

  const applicationCredentials = textoLimpo(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (applicationCredentials) {
    const caminhoApplicationCredentials = resolverCaminhoCredencial(applicationCredentials);

    if (!fs.existsSync(caminhoApplicationCredentials)) {
      throw new Error(`GOOGLE_APPLICATION_CREDENTIALS aponta para um arquivo inexistente: ${caminhoApplicationCredentials}`);
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = caminhoApplicationCredentials;

    return {
      credential: admin.credential.applicationDefault(),
      origem: 'GOOGLE_APPLICATION_CREDENTIALS',
    };
  }

  const caminhoServiceAccount = resolverCaminhoCredencial(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  if (fs.existsSync(caminhoServiceAccount)) {
    return {
      credential: admin.credential.cert(require(caminhoServiceAccount)),
      origem: caminhoServiceAccount,
    };
  }

  throw criarErroConfiguracao();
};

const { credential, origem } = obterCredencialFirebase();
const storageBucket = textoLimpo(process.env.FIREBASE_STORAGE_BUCKET) || 'b-health-app.firebasestorage.app';

admin.initializeApp({
  credential,
  storageBucket,
});

console.log(`[firebase.js] Firebase Admin inicializado com credenciais de ${origem}.`);

const db = admin.firestore();
const bucket = admin.storage().bucket();
const firebaseAuth = admin.auth();

export { db, bucket, firebaseAuth };

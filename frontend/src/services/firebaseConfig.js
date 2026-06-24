import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const variaveisObrigatorias = {
  EXPO_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  EXPO_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: firebaseConfig.measurementId,
};

const variaveisAusentes = Object.entries(variaveisObrigatorias)
  .filter(([, valor]) => !String(valor || '').trim())
  .map(([nome]) => nome);

export const firebaseConfigError = variaveisAusentes.length
  ? `Configuração do Firebase ausente. Crie frontend/.env com as variáveis públicas do Firebase. Variáveis obrigatórias: ${variaveisAusentes.join(', ')}.`
  : '';

const app = firebaseConfigError
  ? null
  : getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const garantirFirebaseConfigurado = () => {
  if (firebaseConfigError) {
    throw new Error(firebaseConfigError);
  }

  return { auth, db };
};

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Substitua pelos dados reais do seu Console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCPhSD6RW4ah7riCmsK1xxHeJEdWc9O6oA",
  authDomain: "b-health-app.firebaseapp.com",
  projectId: "b-health-app",
  storageBucket: "b-health-app.firebasestorage.app",
  messagingSenderId: "920367679286",
  appId: "1:920367679286:web:704f40a29c6a23c5971597",
};

// Padrão Singleton para evitar reinicialização do App no reload
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Inicializa o Auth com persistência
// Usa try/catch para contornar o erro 'auth/already-initialized' no reload
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // Se já estiver inicializado, apenas recupera a instância existente
  auth = getAuth(app);
}

// Inicializa o Banco de Dados (Firestore)
const db = getFirestore(app); 

export { auth, db };
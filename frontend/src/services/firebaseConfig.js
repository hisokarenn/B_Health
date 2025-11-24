import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
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

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência no AsyncStorage
// Isso corrige o aviso e mantém o login entre sessões
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
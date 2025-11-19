import admin from 'firebase-admin';
import { createRequire } from "module"; // Necessário para importar JSON no ES Modules

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json"); // Sua chave baixada

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export default db;
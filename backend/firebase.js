import admin from 'firebase-admin';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

// Inicializa com a URL do Bucket do Storage
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "b-health-app.firebasestorage.app" // Sem o 'gs://' na frente, apenas o domínio
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
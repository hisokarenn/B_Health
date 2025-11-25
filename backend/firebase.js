import admin from 'firebase-admin';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json"); // Sua chave baixada

// em storageBucket colocar o nome do bucket (storage), apenas o domínio sem 'gs://'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "b-health-app.firebasestorage.app" 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
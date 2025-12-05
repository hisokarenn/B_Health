import admin from 'firebase-admin';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "b-health-app.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
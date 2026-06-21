import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  process.env.GCP_KEY
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();

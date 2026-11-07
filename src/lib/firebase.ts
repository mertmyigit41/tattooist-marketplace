import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

// Replace via NEXT_PUBLIC_FIREBASE_* env vars (see .env.example).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "inkbid-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "inkbid-demo",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "inkbid-demo.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:000000000000:web:demo",
};

const emulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;

declare global {
  var __inkbidEmulatorConnected: boolean | undefined;
}

function getApp(): FirebaseApp {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

let dbInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (dbInstance) return dbInstance;
  const db = getFirestore(getApp());
  if (emulatorHost && !globalThis.__inkbidEmulatorConnected) {
    const [host, port] = emulatorHost.split(":");
    connectFirestoreEmulator(db, host, Number(port));
    globalThis.__inkbidEmulatorConnected = true;
  }
  dbInstance = db;
  return db;
}

export const isEmulator = Boolean(emulatorHost);

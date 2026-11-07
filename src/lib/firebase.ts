import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

// Replace via NEXT_PUBLIC_FIREBASE_* env vars (see .env.example).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "inqfy-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "inqfy-demo",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "inqfy-demo.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:000000000000:web:demo",
};

const emulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
const authEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

declare global {
  var __inqfyEmulatorConnected: boolean | undefined;
  var __inqfyAuthEmulatorConnected: boolean | undefined;
}

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function getDb(): Firestore {
  if (dbInstance) return dbInstance;
  const db = getFirestore(getFirebaseApp());
  if (emulatorHost && !globalThis.__inqfyEmulatorConnected) {
    const [host, port] = emulatorHost.split(":");
    connectFirestoreEmulator(db, host, Number(port));
    globalThis.__inqfyEmulatorConnected = true;
  }
  dbInstance = db;
  return db;
}

export function getAuthClient(): Auth {
  if (authInstance) return authInstance;
  const auth = getAuth(getFirebaseApp());
  if (authEmulatorHost && !globalThis.__inqfyAuthEmulatorConnected) {
    const url = authEmulatorHost.startsWith("http")
      ? authEmulatorHost
      : `http://${authEmulatorHost}`;
    connectAuthEmulator(auth, url, { disableWarnings: true });
    globalThis.__inqfyAuthEmulatorConnected = true;
  }
  authInstance = auth;
  return auth;
}

export const isEmulator = Boolean(emulatorHost);

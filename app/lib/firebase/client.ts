import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'test-api-key',
  authDomain: import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'familyxp-local',
  storageBucket: import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'familyxp-local.appspot.com',
  messagingSenderId: import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID || 'test-app-id',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// ─── Emulators ──────────────────────────────────────────────────────────────
// Connexion automatique aux émulateurs Firebase dans l'environnement LOCAL.
// Détection via la variable NUXT_PUBLIC_APP_ENV ou via import.meta.dev.
//
// Pour utiliser les émulateurs :
//   1. Lancer : npm run emulators
//   2. Lancer : npm run dev:local

const appEnv = import.meta.env.NUXT_PUBLIC_APP_ENV || 'local'
const isLocal = appEnv === 'local' || import.meta.dev

if (isLocal) {
  const firestoreHost = import.meta.env.NUXT_PUBLIC_FIRESTORE_EMULATOR_HOST || 'localhost:8080'
  const authHost = import.meta.env.NUXT_PUBLIC_AUTH_EMULATOR_HOST || 'http://localhost:9099'
  const storageHost = import.meta.env.NUXT_PUBLIC_STORAGE_EMULATOR_HOST || 'localhost:9199'

  const [fsHost, fsPort] = firestoreHost.split(':')
  const [stHost, stPort] = storageHost.split(':')

  connectFirestoreEmulator(db, fsHost, parseInt(fsPort))
  connectAuthEmulator(auth, authHost, { disableWarnings: true })
  connectStorageEmulator(storage, stHost, parseInt(stPort))

  console.log(`[FamilyXP] 🔥 Connecté aux émulateurs Firebase (${firestoreHost})`)
}

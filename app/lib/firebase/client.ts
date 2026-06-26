import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'test-api-key',
  authDomain: import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'familyxp-dev',
  storageBucket: import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'familyxp-dev.appspot.com',
  messagingSenderId: import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID || 'test-app-id',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Connect to emulators in development
if (import.meta.dev) {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectStorageEmulator(storage, 'localhost', 9199)
}

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from './client'
import type { User } from '~/app/types'

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export async function signUp(email: string, password: string, displayName: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const firebaseUser = credential.user

  await updateProfile(firebaseUser, { displayName })

  const user: User = {
    id: firebaseUser.uid,
    displayName,
    email,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await setDoc(doc(db, 'users', firebaseUser.uid), user)
  return user
}

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logOut(): Promise<void> {
  await signOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, 'users', userId))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as User
}

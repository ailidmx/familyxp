import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore'
import { db } from './client'

export function getCollectionRef(path: string) {
  return collection(db, path)
}

export function getDocRef(path: string) {
  return doc(db, path)
}

export async function getDocument<T extends DocumentData>(path: string): Promise<T | null> {
  const docSnap = await getDoc(doc(db, path))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as T
}

export async function getDocuments<T extends DocumentData>(
  collectionPath: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionPath), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T))
}

export async function createDocument<T extends DocumentData>(
  collectionPath: string,
  data: Omit<T, 'id'>
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionPath), data)
  return docRef.id
}

export async function setDocument<T extends DocumentData>(
  path: string,
  data: T
): Promise<void> {
  await setDoc(doc(db, path), data)
}

export async function updateDocument(
  path: string,
  data: Partial<DocumentData>
): Promise<void> {
  await updateDoc(doc(db, path), data)
}

export async function deleteDocument(path: string): Promise<void> {
  await deleteDoc(doc(db, path))
}

// Query helpers
export function whereEqual(field: string, value: unknown): QueryConstraint {
  return where(field, '==', value)
}

export function orderByDesc(field: string): QueryConstraint {
  return orderBy(field, 'desc')
}

export function limitTo(n: number): QueryConstraint {
  return limit(n)
}

// Error handler
export function getFirestoreErrorMessage(error: FirestoreError): string {
  const messages: Record<string, string> = {
    'permission-denied': 'Accès refusé. Vérifie tes permissions.',
    'not-found': 'Document introuvable.',
    'already-exists': 'Ce document existe déjà.',
    'unavailable': 'Service temporairement indisponible.',
  }
  return messages[error.code] || 'Une erreur est survenue.'
}

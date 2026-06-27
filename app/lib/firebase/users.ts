import { doc, getDoc, setDoc, updateDoc, query, where, getDocs, collection, Timestamp } from 'firebase/firestore'
import { db } from './client'
import type { User } from '~/app/types'

const COLLECTION = 'users'

/**
 * Récupère un profil utilisateur complet
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, COLLECTION, userId))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as User
}

/**
 * Crée le profil utilisateur dans Firestore après inscription Firebase Auth
 */
export async function createUserProfile(
  userId: string,
  data: {
    displayName: string
    email: string
    birthDate?: Date
    isMinor: boolean
    guardianIds?: string[]
    avatarId?: string
    role?: 'user' | 'admin' | 'superadmin'
  }
): Promise<User> {
  const now = Timestamp.now()

  const user: User = {
    id: userId,
    displayName: data.displayName,
    email: data.email,
    role: data.role ?? 'user',
    avatarId: data.avatarId,
    isMinor: data.isMinor,
    guardianIds: data.guardianIds ?? [],
    createdAt: now,
    updatedAt: now,
  }

  if (data.birthDate) {
    user.birthDate = Timestamp.fromDate(data.birthDate)
  }

  await setDoc(doc(db, COLLECTION, userId), user)
  return user
}

/**
 * Met à jour le profil utilisateur
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, 'displayName' | 'photoURL' | 'birthDate'>>
): Promise<void> {
  const updates: Record<string, unknown> = {
    ...data,
    updatedAt: Timestamp.now(),
  }
  await updateDoc(doc(db, COLLECTION, userId), updates)
}

/**
 * Ajoute un adulte référent à un mineur
 */
export async function addGuardian(userId: string, guardianId: string): Promise<void> {
  const userRef = doc(db, COLLECTION, userId)
  const userSnap = await getDoc(userRef)
  if (!userSnap.exists()) throw new Error('Utilisateur introuvable')

  const currentGuardians = userSnap.data().guardianIds ?? []
  if (!currentGuardians.includes(guardianId)) {
    await updateDoc(userRef, {
      guardianIds: [...currentGuardians, guardianId],
      updatedAt: Timestamp.now(),
    })
  }
}

/**
 * Retire un adulte référent
 */
export async function removeGuardian(userId: string, guardianId: string): Promise<void> {
  const userRef = doc(db, COLLECTION, userId)
  const userSnap = await getDoc(userRef)
  if (!userSnap.exists()) throw new Error('Utilisateur introuvable')

  const currentGuardians = userSnap.data().guardianIds ?? []
  await updateDoc(userRef, {
    guardianIds: currentGuardians.filter((id: string) => id !== guardianId),
    updatedAt: Timestamp.now(),
  })
}

/**
 * Recherche un utilisateur par email (pour trouver un adulte référent)
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, COLLECTION), where('email', '==', email))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as User
}

/**
 * Upload d'avatar (placeholder — sera implémenté avec Firebase Storage plus tard)
 * Pour le MVP, on utilise des avatars générés par défaut (initials)
 */
export function getDefaultAvatarUrl(displayName: string): string {
  // Utilise une API d'avatar par initiales (gratuite)
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=fff&size=128`
}

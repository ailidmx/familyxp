import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './client'
import { createUserProfile, getUserProfile, findUserByEmail, getDefaultAvatarUrl } from './users'
import type { User } from '~/app/types'

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

/**
 * Inscription avec profil complet
 *
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe
 * @param displayName - Nom d'affichage
 * @param options - Options supplémentaires :
 *   - birthDate: Date de naissance (pour déterminer isMinor)
 *   - guardianEmail: Email de l'adulte référent (obligatoire si mineur)
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  options?: {
    birthDate?: Date
    guardianEmail?: string
    avatarId?: string
  }
): Promise<User> {
  // 1. Créer le compte Firebase Auth
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const firebaseUser = credential.user

  // 2. Mettre à jour le profil Firebase Auth
  await updateProfile(firebaseUser, { displayName })

  // 3. Déterminer si mineur (moins de 18 ans)
  let isMinor = false
  let guardianIds: string[] = []

  if (options?.birthDate) {
    const age = calculateAge(options.birthDate)
    isMinor = age < 18
  }

  // 4. Si mineur, vérifier l'adulte référent
  if (isMinor && options?.guardianEmail) {
    const guardian = await findUserByEmail(options.guardianEmail)
    if (guardian) {
      guardianIds = [guardian.id]
    }
    // Si le référent n'existe pas encore, on laisse guardianIds vide
    // L'adulte pourra être ajouté plus tard via addGuardian()
  }

  // 5. Créer le profil Firestore
  const user = await createUserProfile(firebaseUser.uid, {
    displayName,
    email,
    birthDate: options?.birthDate,
    isMinor,
    guardianIds,
    avatarId: options?.avatarId,
  })

  // 6. Si pas d'avatar choisi, définir un avatar par défaut (initiales)
  if (!options?.avatarId) {
    const avatarUrl = getDefaultAvatarUrl(displayName)
    if (avatarUrl) {
      await updateProfile(firebaseUser, { photoURL: avatarUrl })
    }
  }

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

/**
 * Calcule l'âge à partir d'une date de naissance
 */
function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

import type { Timestamp } from 'firebase/firestore'

/**
 * Utilisateur de FamilyXP
 *
 * Un utilisateur peut être :
 * - Adulte (isMinor = false) : peut valider, créer des contrats, gérer les foyers
 * - Mineur (isMinor = true) : doit être rattaché à au moins un adulte référent (guardianIds)
 *
 * L'avatar peut être :
 * - Une photo uploadée (photoURL)
 * - Un avatar généré par défaut (initials, emoji, etc.)
 */
export interface User {
  id: string
  displayName: string
  email: string

  /** URL de la photo de profil (Firebase Storage ou externe) */
  photoURL?: string

  /** ID de l'avatar ludique choisi (depuis la collection AVATARS) */
  avatarId?: string

  /** Date de naissance (pour déterminer l'âge et les droits) */
  birthDate?: Timestamp

  /** true si l'utilisateur est mineur (< 18 ans) */
  isMinor: boolean

  /** IDs des adultes référents (parents/tuteurs) — obligatoire si isMinor */
  guardianIds: string[]

  /** Timestamp de création du compte */
  createdAt: Timestamp

  /** Timestamp de dernière modification */
  updatedAt: Timestamp
}

/**
 * Données nécessaires à l'inscription
 * (ce qu'on collecte dans le formulaire)
 */
export interface SignUpData {
  displayName: string
  email: string
  password: string
  birthDate?: Date
  isMinor: boolean
  guardianEmail?: string // Email de l'adulte référent (pour les mineurs)
}

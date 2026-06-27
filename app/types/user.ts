/**
 * Types pour les utilisateurs
 * 
 * Un utilisateur = une personne physique identifiée par Firebase Auth.
 * Les données de profil sont stockées dans Firestore (collection "users").
 */

import type { Timestamp } from 'firebase/firestore'

/** Rôles possibles dans un foyer */
export type HouseholdRole = 'admin' | 'parent' | 'child' | 'guest'

/** Statut du consentement */
export type ConsentStatus = 'pending' | 'granted' | 'denied' | 'expired'

/** Genre (optionnel, pour l'affichage) */
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export interface UserProfile {
  /** UID Firebase Auth */
  uid: string
  /** Email (provenant de Firebase Auth) */
  email: string
  /** Nom d'affichage */
  displayName: string
  /** Photo de profil (URL Firebase Storage) */
  photoURL?: string
  /** Date de naissance (pour vérification âge) */
  birthDate?: Timestamp
  /** Genre (optionnel) */
  gender?: Gender
  /** Date de création du compte */
  createdAt: Timestamp
  /** Dernière connexion */
  lastLoginAt?: Timestamp
  /** Préférences de langue */
  locale: 'fr' | 'en' | 'es'
  /** Consentement RGPD / LFPDPPP */
  consent: {
    status: ConsentStatus
    /** Version de la politique acceptée */
    policyVersion: number
    /** Date d'acceptation */
    acceptedAt?: Timestamp
    /** UID du parent ayant donné le consentement (pour mineurs) */
    parentUid?: string
  }
  /** Compte actif ou supprimé */
  isActive: boolean
}

/** Données minimales pour la création d'un utilisateur */
export interface UserCreateInput {
  uid: string
  email: string
  displayName: string
  locale?: 'fr' | 'en' | 'es'
  birthDate?: Date
}

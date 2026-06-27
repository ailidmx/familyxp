/**
 * Types pour les foyers (households)
 * 
 * Un foyer = un groupe familial avec son propre contrat, ses propres règles,
 * ses propres points et son propre historique.
 * 
 * Un utilisateur peut appartenir à plusieurs foyers (garde alternée, grands-parents, etc.)
 */

import type { Timestamp } from 'firebase/firestore'
import type { HouseholdRole } from './user'

export interface Household {
  /** ID Firestore */
  id: string
  /** Nom du foyer (ex: "Foyer Papa", "Foyer Maman") */
  name: string
  /** Description optionnelle */
  description?: string
  /** Photo du foyer */
  photoURL?: string
  /** Code d'invitation pour rejoindre le foyer */
  inviteCode: string
  /** Date de création */
  createdAt: Timestamp
  /** Dernière modification */
  updatedAt: Timestamp
  /** Foyer actif ou archivé */
  isActive: boolean
  /** Abonnement premium */
  plan: 'free' | 'premium'
  /** Limites du plan */
  limits: {
    maxMembers: number
    maxContracts: number
    maxRules: number
  }
}

export interface Membership {
  /** ID Firestore (auto-généré) */
  id: string
  /** UID de l'utilisateur */
  userId: string
  /** ID du foyer */
  householdId: string
  /** Rôle dans ce foyer */
  role: HouseholdRole
  /** Surnom dans ce foyer (ex: "Papa", "Maman") */
  nickname?: string
  /** Date d'ajout au foyer */
  joinedAt: Timestamp
  /** Membre actif dans ce foyer */
  isActive: boolean
  /** Date de départ (si quitte le foyer) */
  leftAt?: Timestamp
}

/** Données pour la création d'un foyer */
export interface HouseholdCreateInput {
  name: string
  description?: string
  createdBy: string // UID du créateur
}

/** Données pour inviter un membre */
export interface Invitation {
  id: string
  /** Code d'invitation unique */
  code: string
  /** Foyer concerné */
  householdId: string
  /** Email de la personne invitée */
  email: string
  /** Rôle proposé */
  role: HouseholdRole
  /** Statut */
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  /** Date d'envoi */
  sentAt: Timestamp
  /** Date d'expiration */
  expiresAt: Timestamp
  /** Date de réponse */
  respondedAt?: Timestamp
  /** UID de la personne qui a invité */
  invitedBy: string
}

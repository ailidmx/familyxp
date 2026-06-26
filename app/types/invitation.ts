import type { Timestamp } from 'firebase/firestore'
import type { MembershipRole } from './membership'

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

export interface Invitation {
  id: string
  householdId: string
  invitedEmail: string
  invitedBy: string
  role: MembershipRole
  status: InvitationStatus
  expiresAt: Timestamp
  createdAt: Timestamp
}

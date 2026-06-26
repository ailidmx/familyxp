import type { Timestamp } from 'firebase/firestore'

export type MembershipRole = 'admin' | 'parent' | 'child' | 'viewer'

export interface Membership {
  id: string
  userId: string
  householdId: string
  role: MembershipRole
  displayName?: string
  avatar?: string
  points: number
  joinedAt: Timestamp
  isActive: boolean
}

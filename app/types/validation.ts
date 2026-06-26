import type { Timestamp } from 'firebase/firestore'

export type ValidationTargetType = 'point_event' | 'reward_claim'
export type ValidationStatus = 'approved' | 'rejected'

export interface Validation {
  id: string
  householdId: string
  targetId: string
  targetType: ValidationTargetType
  validatedBy: string
  status: ValidationStatus
  comment?: string
  createdAt: Timestamp
}

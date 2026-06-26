import type { Timestamp } from 'firebase/firestore'

export type PointEventType = 'bonus' | 'malus' | 'manual' | 'reward'
export type PointEventStatus = 'pending' | 'approved' | 'rejected'

export interface PointEvent {
  id: string
  householdId: string
  contractId: string
  ruleId?: string
  userId: string
  createdBy: string
  points: number
  type: PointEventType
  description: string
  status: PointEventStatus
  validatedBy?: string
  validatedAt?: Timestamp
  createdAt: Timestamp
}

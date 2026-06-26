import type { Timestamp } from 'firebase/firestore'

export type RewardClaimStatus = 'pending' | 'approved' | 'rejected' | 'redeemed'

export interface RewardClaim {
  id: string
  householdId: string
  rewardId: string
  userId: string
  status: RewardClaimStatus
  pointsAtClaim: number
  approvedBy?: string
  approvedAt?: Timestamp
  rejectedReason?: string
  redeemedAt?: Timestamp
  createdAt: Timestamp
}

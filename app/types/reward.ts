import type { Timestamp } from 'firebase/firestore'

export type RewardCategory = 'screen_time' | 'activity' | 'treat' | 'money' | 'custom'

export interface Reward {
  id: string
  contractId: string
  name: string
  description?: string
  pointsCost: number
  icon?: string
  category: RewardCategory
  stock?: number
  isActive: boolean
  createdAt: Timestamp
}

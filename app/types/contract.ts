import type { Timestamp } from 'firebase/firestore'
import type { Rule } from './rule'
import type { Reward } from './reward'

export type ContractStatus = 'draft' | 'active' | 'paused' | 'archived'

export interface Contract {
  id: string
  householdId: string
  name: string
  description?: string
  status: ContractStatus
  startDate: Timestamp
  endDate?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  validatedBy: string[]
  rules: Rule[]
  rewards: Reward[]
}

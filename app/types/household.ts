import type { Timestamp } from 'firebase/firestore'

export interface Household {
  id: string
  name: string
  description?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  isPremium: boolean
  settings: {
    currency: string
    maxPointsPerDay?: number
    requireValidation: boolean
  }
}

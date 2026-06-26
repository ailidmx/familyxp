import type { Timestamp } from 'firebase/firestore'

export type RuleType = 'bonus' | 'malus'
export type RuleCategory = 'chores' | 'school' | 'behavior' | 'health' | 'custom'
export type RuleFrequency = 'daily' | 'weekly' | 'monthly' | 'once'

export interface Rule {
  id: string
  contractId: string
  type: RuleType
  category: RuleCategory
  name: string
  description?: string
  points: number
  icon?: string
  frequency: RuleFrequency
  maxPerDay?: number
  requiresValidation: boolean
  isActive: boolean
  createdAt: Timestamp
}

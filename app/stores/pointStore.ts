import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Timestamp, where, orderBy, limit } from 'firebase/firestore'
import { getDocuments, createDocument, updateDocument } from '~/app/lib/firebase/firestore'
import { useHouseholdStore } from './householdStore'

export interface PointEvent {
  id: string
  householdId: string
  contractId: string
  ruleId?: string
  memberId: string
  validatedBy?: string
  type: 'bonus' | 'malus'
  points: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
  validatedAt?: Timestamp
}

export const usePointStore = defineStore('point', () => {
  const pointEvents = ref<PointEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Getters ───────────────────────────────────────────────────────────────

  const pendingValidations = computed(() =>
    pointEvents.value.filter((e) => e.status === 'pending')
  )

  const recentEvents = computed(() =>
    [...pointEvents.value]
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 20)
  )

  // ─── Actions ───────────────────────────────────────────────────────────────

  async function loadEvents(householdId: string, limitCount = 50) {
    loading.value = true
    error.value = null
    try {
      pointEvents.value = await getDocuments<PointEvent>(
        'pointEvents',
        where('householdId', '==', householdId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    } catch (e: any) {
      error.value = e.message || 'Erreur lors du chargement des événements'
    } finally {
      loading.value = false
    }
  }

  async function addPoints(
    householdId: string,
    contractId: string,
    ruleId: string | undefined,
    memberId: string,
    points: number,
    reason: string
  ): Promise<string> {
    error.value = null
    try {
      const event: Omit<PointEvent, 'id'> = {
        householdId,
        contractId,
        ruleId,
        memberId,
        type: 'bonus',
        points,
        reason,
        status: 'pending',
        createdAt: Timestamp.now(),
      }
      const id = await createDocument('pointEvents', event)
      pointEvents.value.unshift({ id, ...event })
      return id
    } catch (e: any) {
      error.value = e.message || "Erreur lors de l'ajout des points"
      throw e
    }
  }

  async function removePoints(
    householdId: string,
    contractId: string,
    ruleId: string | undefined,
    memberId: string,
    points: number,
    reason: string
  ): Promise<string> {
    error.value = null
    try {
      const event: Omit<PointEvent, 'id'> = {
        householdId,
        contractId,
        ruleId,
        memberId,
        type: 'malus',
        points,
        reason,
        status: 'pending',
        createdAt: Timestamp.now(),
      }
      const id = await createDocument('pointEvents', event)
      pointEvents.value.unshift({ id, ...event })
      return id
    } catch (e: any) {
      error.value = e.message || 'Erreur lors du retrait des points'
      throw e
    }
  }

  async function validateEvent(
    eventId: string,
    validatedBy: string,
    status: 'approved' | 'rejected'
  ) {
    error.value = null
    try {
      await updateDocument(`pointEvents/${eventId}`, {
        status,
        validatedBy,
        validatedAt: Timestamp.now(),
      })
      const idx = pointEvents.value.findIndex((e) => e.id === eventId)
      if (idx !== -1) {
        pointEvents.value[idx].status = status
        pointEvents.value[idx].validatedBy = validatedBy
        pointEvents.value[idx].validatedAt = Timestamp.now()
      }
    } catch (e: any) {
      error.value = e.message || 'Erreur lors de la validation'
      throw e
    }
  }

  async function getMemberBalance(
    householdId: string,
    memberId: string
  ): Promise<number> {
    try {
      const events = await getDocuments<PointEvent>(
        'pointEvents',
        where('householdId', '==', householdId),
        where('memberId', '==', memberId),
        where('status', '==', 'approved')
      )
      return events.reduce((total, e) => {
        return e.type === 'bonus' ? total + e.points : total - e.points
      }, 0)
    } catch {
      return 0
    }
  }

  async function getLeaderboard(
    householdId: string
  ): Promise<{ memberId: string; balance: number }[]> {
    try {
      const events = await getDocuments<PointEvent>(
        'pointEvents',
        where('householdId', '==', householdId),
        where('status', '==', 'approved')
      )
      const balances = new Map<string, number>()
      for (const e of events) {
        const current = balances.get(e.memberId) || 0
        balances.set(
          e.memberId,
          e.type === 'bonus' ? current + e.points : current - e.points
        )
      }
      return Array.from(balances.entries())
        .map(([memberId, balance]) => ({ memberId, balance }))
        .sort((a, b) => b.balance - a.balance)
    } catch {
      return []
    }
  }

  return {
    pointEvents,
    loading,
    error,
    pendingValidations,
    recentEvents,
    loadEvents,
    addPoints,
    removePoints,
    validateEvent,
    getMemberBalance,
    getLeaderboard,
  }
})

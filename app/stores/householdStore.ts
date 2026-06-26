import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Timestamp, where } from 'firebase/firestore'
import { getDocuments, createDocument, setDocument } from '~/app/lib/firebase/firestore'
import { useAuthStore } from './authStore'
import type { Household, Membership } from '~/app/types'

export const useHouseholdStore = defineStore('household', () => {
  const households = ref<Household[]>([])
  const memberships = ref<Membership[]>([])
  const currentHouseholdId = ref<string | null>(null)
  const isLoading = ref(false)

  const currentHousehold = computed(() =>
    households.value.find((h) => h.id === currentHouseholdId.value) ?? null
  )

  const currentMembership = computed(() =>
    memberships.value.find((m) => m.householdId === currentHouseholdId.value) ?? null
  )

  const currentRole = computed(() => currentMembership.value?.role ?? null)

  const isAdmin = computed(() => currentRole.value === 'admin')
  const isParent = computed(() => currentRole.value === 'admin' || currentRole.value === 'parent')

  async function loadHouseholds() {
    const authStore = useAuthStore()
    if (!authStore.userId) return

    isLoading.value = true
    try {
      memberships.value = await getDocuments<Membership>(
        'memberships',
        where('userId', '==', authStore.userId),
        where('isActive', '==', true)
      )

      const householdIds = memberships.value.map((m) => m.householdId)
      households.value = await Promise.all(
        householdIds.map((id) =>
          getDocuments<Household>('households', where('id', '==', id))
        )
      ).then((results) => results.flat())

      if (!currentHouseholdId.value && households.value.length > 0) {
        currentHouseholdId.value = households.value[0]!.id
      }
    } catch (error) {
      console.error('Error loading households:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function createHousehold(name: string, description?: string) {
    const authStore = useAuthStore()
    if (!authStore.userId) throw new Error('Not authenticated')

    const householdId = await createDocument<Omit<Household, 'id'>>('households', {
      name,
      description,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: authStore.userId,
      isPremium: false,
      settings: {
        currency: 'XP',
        requireValidation: true,
      },
    })

    await setDocument<Membership>(`memberships/${authStore.userId}_${householdId}`, {
      id: `${authStore.userId}_${householdId}`,
      userId: authStore.userId,
      householdId,
      role: 'admin',
      displayName: authStore.displayName,
      points: 0,
      joinedAt: Timestamp.now(),
      isActive: true,
    })

    await loadHouseholds()
    currentHouseholdId.value = householdId
    return householdId
  }

  function setCurrentHousehold(householdId: string) {
    currentHouseholdId.value = householdId
  }

  return {
    households,
    memberships,
    currentHouseholdId,
    isLoading,
    currentHousehold,
    currentMembership,
    currentRole,
    isAdmin,
    isParent,
    loadHouseholds,
    createHousehold,
    setCurrentHousehold,
  }
})

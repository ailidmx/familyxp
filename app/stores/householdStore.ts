import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Timestamp, where } from 'firebase/firestore'
import { getDocuments, createDocument, setDocument, updateDocument, deleteDocument } from '~/app/lib/firebase/firestore'
import { useAuthStore } from './authStore'
import type { Household, Membership, Invitation } from '~/app/types'
import type { UserProfile } from '~/app/types/user'

export const useHouseholdStore = defineStore('household', () => {
  const households = ref<Household[]>([])
  const memberships = ref<Membership[]>([])
  const currentHouseholdId = ref<string | null>(null)
  const currentMembers = ref<UserProfile[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentHousehold = computed(() =>
    households.value.find((h) => h.id === currentHouseholdId.value) ?? null
  )

  const currentMembership = computed(() =>
    memberships.value.find((m) => m.householdId === currentHouseholdId.value) ?? null
  )

  const currentRole = computed(() => currentMembership.value?.role ?? null)

  const isAdmin = computed(() => currentRole.value === 'admin')
  const isParent = computed(() => currentRole.value === 'admin' || currentRole.value === 'parent')
  const memberCount = computed(() => currentMembers.value.length)

  async function loadHouseholds() {
    const authStore = useAuthStore()
    if (!authStore.userId) return

    isLoading.value = true
    error.value = null
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
    } catch (err) {
      console.error('Error loading households:', err)
      error.value = 'Erreur lors du chargement des foyers'
    } finally {
      isLoading.value = false
    }
  }

  async function createHousehold(name: string, description?: string) {
    const authStore = useAuthStore()
    if (!authStore.userId) throw new Error('Not authenticated')

    error.value = null
    const inviteCode = generateInviteCode()

    const householdId = await createDocument<Omit<Household, 'id'>>('households', {
      name,
      description,
      inviteCode,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
      plan: 'free',
      limits: {
        maxMembers: 6,
        maxContracts: 1,
        maxRules: 20,
      },
    })

    await setDocument<Membership>(`memberships/${authStore.userId}_${householdId}`, {
      id: `${authStore.userId}_${householdId}`,
      userId: authStore.userId,
      householdId,
      role: 'admin',
      nickname: authStore.displayName,
      joinedAt: Timestamp.now(),
      isActive: true,
    })

    await loadHouseholds()
    currentHouseholdId.value = householdId
    return householdId
  }

  async function fetchMembers(householdId: string) {
    isLoading.value = true
    error.value = null
    try {
      const memberDocs = await getDocuments<Membership>(
        'memberships',
        where('householdId', '==', householdId),
        where('isActive', '==', true)
      )

      const userIds = memberDocs.map((m) => m.userId)
      currentMembers.value = await Promise.all(
        userIds.map((uid) =>
          getDocuments<UserProfile>('users', where('uid', '==', uid))
        )
      ).then((results) => results.flat())
    } catch (err) {
      console.error('Error fetching members:', err)
      error.value = 'Erreur lors du chargement des membres'
    } finally {
      isLoading.value = false
    }
  }

  async function inviteMember(householdId: string, email: string, role: 'parent' | 'child' | 'guest') {
    const authStore = useAuthStore()
    if (!authStore.userId) throw new Error('Not authenticated')
    if (!isParent.value) throw new Error('Seuls les parents peuvent inviter')

    error.value = null
    const code = generateInviteCode()

    await createDocument<Omit<Invitation, 'id'>>('invitations', {
      code,
      householdId,
      email,
      role,
      status: 'pending',
      sentAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 jours
      invitedBy: authStore.userId,
    })

    return code
  }

  async function acceptInvitation(code: string) {
    const authStore = useAuthStore()
    if (!authStore.userId) throw new Error('Not authenticated')

    error.value = null
    const invitations = await getDocuments<Invitation>(
      'invitations',
      where('code', '==', code),
      where('status', '==', 'pending')
    )

    if (invitations.length === 0) {
      throw new Error('Code d\'invitation invalide ou expiré')
    }

    const invitation = invitations[0]!

    // Vérifier que l'email correspond
    if (invitation.email !== authStore.email) {
      throw new Error('Cette invitation n\'est pas pour vous')
    }

    // Créer la membership
    await setDocument<Membership>(`memberships/${authStore.userId}_${invitation.householdId}`, {
      id: `${authStore.userId}_${invitation.householdId}`,
      userId: authStore.userId,
      householdId: invitation.householdId,
      role: invitation.role,
      nickname: authStore.displayName,
      joinedAt: Timestamp.now(),
      isActive: true,
    })

    // Marquer l'invitation comme acceptée
    await updateDocument(`invitations/${invitation.id}`, {
      status: 'accepted',
      respondedAt: Timestamp.now(),
    })

    await loadHouseholds()
    currentHouseholdId.value = invitation.householdId
  }

  async function removeMember(householdId: string, userId: string) {
    if (!isAdmin.value) throw new Error('Seuls les admins peuvent retirer des membres')

    error.value = null
    await updateDocument(`memberships/${userId}_${householdId}`, {
      isActive: false,
      leftAt: Timestamp.now(),
    })

    await fetchMembers(householdId)
  }

  function setCurrentHousehold(householdId: string) {
    currentHouseholdId.value = householdId
    fetchMembers(householdId)
  }

  function generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  return {
    households,
    memberships,
    currentHouseholdId,
    currentMembers,
    isLoading,
    error,
    currentHousehold,
    currentMembership,
    currentRole,
    isAdmin,
    isParent,
    memberCount,
    loadHouseholds,
    createHousehold,
    fetchMembers,
    inviteMember,
    acceptInvitation,
    removeMember,
    setCurrentHousehold,
  }
})

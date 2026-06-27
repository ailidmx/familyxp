import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Timestamp, where } from 'firebase/firestore'
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from '~/app/lib/firebase/firestore'
import { useAuthStore } from './authStore'
import { useHouseholdStore } from './householdStore'
import type { Contract } from '~/app/types'
import type { Rule } from '~/app/types'
import type { Reward } from '~/app/types'

export const useContractStore = defineStore('contract', () => {
  const t = (key: string) => {
    const i18n = useNuxtApp().$i18n as { t?: (k: string) => string } | undefined
    return i18n?.t?.(key) || key
  }

  const contracts = ref<Contract[]>([])
  const currentContract = ref<Contract | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentContractId = computed(() => currentContract.value?.id ?? null)
  const isDraft = computed(() => currentContract.value?.status === 'draft')
  const isActive = computed(() => currentContract.value?.status === 'active')

  const bonusRules = computed(() =>
    currentContract.value?.rules.filter((r) => r.type === 'bonus') ?? []
  )

  const malusRules = computed(() =>
    currentContract.value?.rules.filter((r) => r.type === 'malus') ?? []
  )

  // ─── Contrats ─────────────────────────────────────────────────────────────

  async function loadContracts() {
    const householdStore = useHouseholdStore()
    if (!householdStore.currentHouseholdId) return

    isLoading.value = true
    error.value = null
    try {
      contracts.value = await getDocuments<Contract>(
        'contracts',
        where('householdId', '==', householdStore.currentHouseholdId)
      )
    } catch (err) {
      console.error('Error loading contracts:', err)
      error.value = t('storeErrors.contract.loadContracts')
    } finally {
      isLoading.value = false
    }
  }

  async function loadContract(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const contract = await getDocument<Contract>(`contracts/${id}`)
      if (!contract) {
        error.value = t('storeErrors.contract.notFound')
        currentContract.value = null
        return
      }
      currentContract.value = contract
    } catch (err) {
      console.error('Error loading contract:', err)
      error.value = t('storeErrors.contract.loadContract')
      currentContract.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function createContract(data: {
    name: string
    description?: string
    startDate: Date
    endDate?: Date
  }) {
    const authStore = useAuthStore()
    const householdStore = useHouseholdStore()
    if (!authStore.userId || !householdStore.currentHouseholdId) {
      throw new Error('Non authentifié ou aucun foyer sélectionné')
    }

    error.value = null
    const contractId = await createDocument<Omit<Contract, 'id'>>('contracts', {
      householdId: householdStore.currentHouseholdId,
      name: data.name,
      description: data.description,
      status: 'draft',
      startDate: Timestamp.fromDate(data.startDate),
      endDate: data.endDate ? Timestamp.fromDate(data.endDate) : undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: authStore.userId,
      validatedBy: [],
      rules: [],
      rewards: [],
    })

    await loadContracts()
    return contractId
  }

  async function updateContract(id: string, data: Partial<Omit<Contract, 'id'>>) {
    error.value = null
    try {
      await updateDocument(`contracts/${id}`, {
        ...data,
        updatedAt: Timestamp.now(),
      })
      if (currentContract.value?.id === id) {
        currentContract.value = {
          ...currentContract.value,
          ...data,
          updatedAt: Timestamp.now() as any,
        }
      }
    } catch (err) {
      console.error('Error updating contract:', err)
      error.value = t('storeErrors.contract.updateContract')
    }
  }

  async function activateContract(id: string) {
    await updateContract(id, { status: 'active' })
  }

  async function deleteContract(id: string) {
    error.value = null
    try {
      await deleteDocument(`contracts/${id}`)
      if (currentContract.value?.id === id) {
        currentContract.value = null
      }
      contracts.value = contracts.value.filter((c) => c.id !== id)
    } catch (err) {
      console.error('Error deleting contract:', err)
      error.value = t('storeErrors.contract.deleteContract')
    }
  }

  // ─── Règles ───────────────────────────────────────────────────────────────

  async function addRule(rule: Omit<Rule, 'id' | 'contractId' | 'createdAt'>) {
    const contract = currentContract.value
    if (!contract) return

    const newRule: Rule = {
      ...rule,
      id: crypto.randomUUID(),
      contractId: contract.id,
      createdAt: Timestamp.now() as any,
    }

    const updatedRules = [...(contract.rules || []), newRule]
    await updateDocument(`contracts/${contract.id}`, {
      rules: updatedRules,
      updatedAt: Timestamp.now(),
    })

    currentContract.value = {
      ...contract,
      rules: updatedRules,
      updatedAt: Timestamp.now() as any,
    }
  }

  async function updateRule(ruleId: string, data: Partial<Omit<Rule, 'id' | 'contractId' | 'createdAt'>>) {
    const contract = currentContract.value
    if (!contract) return

    const updatedRules = (contract.rules || []).map((r) =>
      r.id === ruleId ? { ...r, ...data } : r
    )

    await updateDocument(`contracts/${contract.id}`, {
      rules: updatedRules,
      updatedAt: Timestamp.now(),
    })

    currentContract.value = {
      ...contract,
      rules: updatedRules,
      updatedAt: Timestamp.now() as any,
    }
  }

  async function deleteRule(ruleId: string) {
    const contract = currentContract.value
    if (!contract) return

    const updatedRules = (contract.rules || []).filter((r) => r.id !== ruleId)

    await updateDocument(`contracts/${contract.id}`, {
      rules: updatedRules,
      updatedAt: Timestamp.now(),
    })

    currentContract.value = {
      ...contract,
      rules: updatedRules,
      updatedAt: Timestamp.now() as any,
    }
  }

  // ─── Récompenses ──────────────────────────────────────────────────────────

  async function addReward(reward: Omit<Reward, 'id' | 'contractId' | 'createdAt'>) {
    const contract = currentContract.value
    if (!contract) return

    const newReward: Reward = {
      ...reward,
      id: crypto.randomUUID(),
      contractId: contract.id,
      createdAt: Timestamp.now() as any,
    }

    const updatedRewards = [...(contract.rewards || []), newReward]
    await updateDocument(`contracts/${contract.id}`, {
      rewards: updatedRewards,
      updatedAt: Timestamp.now(),
    })

    currentContract.value = {
      ...contract,
      rewards: updatedRewards,
      updatedAt: Timestamp.now() as any,
    }
  }

  async function updateReward(rewardId: string, data: Partial<Omit<Reward, 'id' | 'contractId' | 'createdAt'>>) {
    const contract = currentContract.value
    if (!contract) return

    const updatedRewards = (contract.rewards || []).map((r) =>
      r.id === rewardId ? { ...r, ...data } : r
    )

    await updateDocument(`contracts/${contract.id}`, {
      rewards: updatedRewards,
      updatedAt: Timestamp.now(),
    })

    currentContract.value = {
      ...contract,
      rewards: updatedRewards,
      updatedAt: Timestamp.now() as any,
    }
  }

  async function deleteReward(rewardId: string) {
    const contract = currentContract.value
    if (!contract) return

    const updatedRewards = (contract.rewards || []).filter((r) => r.id !== rewardId)

    await updateDocument(`contracts/${contract.id}`, {
      rewards: updatedRewards,
      updatedAt: Timestamp.now(),
    })

    currentContract.value = {
      ...contract,
      rewards: updatedRewards,
      updatedAt: Timestamp.now() as any,
    }
  }

  return {
    contracts,
    currentContract,
    isLoading,
    error,
    currentContractId,
    isDraft,
    isActive,
    bonusRules,
    malusRules,
    loadContracts,
    loadContract,
    createContract,
    updateContract,
    activateContract,
    deleteContract,
    addRule,
    updateRule,
    deleteRule,
    addReward,
    updateReward,
    deleteReward,
  }
})

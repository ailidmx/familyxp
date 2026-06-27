<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">{{ $t('contract.title') }}</h1>
      <NuxtLink
        to="/contract/create"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        + {{ $t('contract.create') }}
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="text-4xl">⏳</div>
        <p class="mt-2 text-sm text-muted-foreground">{{ $t('app.loading') }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="contracts.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">📝</div>
      <p class="text-sm text-muted-foreground">{{ $t('contract.noContract') }}</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ $t('contract.createPrompt') }}</p>
      <NuxtLink
        to="/contract/create"
        class="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {{ $t('contract.create') }}
      </NuxtLink>
    </div>

    <!-- Contract list -->
    <div v-else class="space-y-3">
      <div
        v-for="contract in contracts"
        :key="contract.id"
        class="rounded-lg border bg-card p-4 shadow-sm hover:bg-accent transition-colors cursor-pointer"
        @click="viewContract(contract.id)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h3 class="font-medium truncate">{{ contract.name }}</h3>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ formatPeriod(contract) }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ $t('contract.rules') }} : {{ contract.rules?.length ?? 0 }}
            </p>
          </div>
          <span
            :class="statusBadgeClass(contract.status)"
          >
            {{ $t(`contract.status.${contract.status}`) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { ref, onMounted } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'
import { getDocuments, where } from '~/app/lib/firebase/firestore'
import type { Contract, ContractStatus } from '~/app/types'

const householdStore = useHouseholdStore()
const router = useRouter()
const { t } = useI18n()

const contracts = ref<Contract[]>([])
const isLoading = ref(true)

onMounted(async () => {
  await loadContracts()
})

async function loadContracts() {
  isLoading.value = true
  try {
    const householdId = householdStore.currentHouseholdId
    if (!householdId) {
      contracts.value = []
      return
    }

    contracts.value = await getDocuments<Contract>(
      'contracts',
      where('householdId', '==', householdId)
    )
  } catch (err) {
    console.error('Error loading contracts:', err)
    contracts.value = []
  } finally {
    isLoading.value = false
  }
}

function formatPeriod(contract: Contract): string {
  const start = contract.startDate?.toDate?.() ?? new Date(contract.startDate as any)
  const startStr = start.toLocaleDateString()

  if (!contract.endDate) return `${t('contract.startDate')} : ${startStr}`

  const end = contract.endDate.toDate()
  const endStr = end.toLocaleDateString()
  return `${startStr} → ${endStr}`
}

function statusBadgeClass(status: ContractStatus): string {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0'
  const colors: Record<ContractStatus, string> = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return `${base} ${colors[status] ?? colors.draft}`
}

function viewContract(id: string) {
  router.push(`/contract/${id}`)
}
</script>

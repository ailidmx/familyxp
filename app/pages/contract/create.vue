<template>
  <div class="space-y-6">
    <h1 class="text-lg font-semibold">{{ $t('contract.create') }}</h1>

    <form @submit.prevent="handleCreate" class="space-y-4">
      <div>
        <label class="text-sm font-medium" for="name">{{ $t('contract.name') }}</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          :placeholder="$t('contract.name')"
        />
      </div>

      <div>
        <label class="text-sm font-medium" for="description">{{ $t('rules.description') }}</label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div>
        <label class="text-sm font-medium" for="startDate">{{ $t('contract.startDate') }}</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
          required
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label class="text-sm font-medium" for="endDate">{{ $t('contract.endDate') }}</label>
        <input
          id="endDate"
          v-model="endDate"
          type="date"
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p class="mt-1 text-xs text-muted-foreground">{{ $t('contract.period') }}</p>
      </div>

      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {{ isLoading ? $t('app.loading') : $t('contract.create') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'
import { useContractStore } from '~/app/stores/contractStore'

definePageMeta({ middleware: 'auth' })

const householdStore = useHouseholdStore()
const contractStore = useContractStore()
const router = useRouter()
const { t } = useI18n()

const name = ref('')
const description = ref('')
const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleCreate() {
  if (!householdStore.currentHouseholdId) {
    error.value = t('household.select')
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const contractId = await contractStore.createContract(
      householdStore.currentHouseholdId,
      name.value,
      description.value || undefined,
      new Date(startDate.value),
      endDate.value ? new Date(endDate.value) : undefined
    )
    router.push(`/contract/${contractId}`)
  } catch (e: any) {
    error.value = e.message || t('app.error')
  } finally {
    isLoading.value = false
  }
}
</script>

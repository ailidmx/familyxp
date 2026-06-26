<template>
  <div class="space-y-6">
    <h1 class="text-lg font-semibold">{{ $t('household.createTitle') }}</h1>

    <form @submit.prevent="handleCreate" class="space-y-4">
      <div>
        <label class="text-sm font-medium" for="name">{{ $t('household.name') }}</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          :placeholder="$t('household.namePlaceholder')"
        />
      </div>
      <div>
        <label class="text-sm font-medium" for="description">{{ $t('household.description') }}</label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          :placeholder="$t('household.descriptionPlaceholder')"
        />
      </div>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {{ isLoading ? $t('app.loading') : $t('household.create') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'

const householdStore = useHouseholdStore()
const router = useRouter()
const { t } = useI18n()

const name = ref('')
const description = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleCreate() {
  error.value = ''
  isLoading.value = true
  try {
    await householdStore.createHousehold(name.value, description.value || undefined)
    router.push('/')
  } catch (e: any) {
    error.value = t('app.error')
  } finally {
    isLoading.value = false
  }
}
</script>

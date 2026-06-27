<template>
  <div class="space-y-6">
    <h1 class="text-lg font-semibold">{{ $t('household.joinTitle') }}</h1>
    <p class="text-sm text-muted-foreground">{{ $t('household.joinDescription') }}</p>

    <form @submit.prevent="handleJoin" class="space-y-4">
      <div>
        <label class="text-sm font-medium" for="code">{{ $t('household.inviteCode') }}</label>
        <input
          id="code"
          v-model="code"
          type="text"
          required
          maxlength="6"
          class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring uppercase tracking-widest text-center text-lg"
          :placeholder="$t('household.codePlaceholder')"
        />
      </div>

      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <p v-if="success" class="text-sm text-green-600">{{ success }}</p>

      <button
        type="submit"
        :disabled="isLoading || code.length !== 6"
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {{ isLoading ? $t('app.loading') : $t('household.join') }}
      </button>
    </form>

    <div class="text-center">
      <NuxtLink to="/household" class="text-sm text-primary hover:underline">
        {{ $t('household.backToList') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'

const householdStore = useHouseholdStore()
const router = useRouter()
const { t } = useI18n()

const code = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)

async function handleJoin() {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await householdStore.acceptInvitation(code.value.toUpperCase())
    success.value = t('household.joinSuccess')
    setTimeout(() => router.push('/'), 1500)
  } catch (e: any) {
    error.value = e.message || t('app.error')
  } finally {
    isLoading.value = false
  }
}
</script>

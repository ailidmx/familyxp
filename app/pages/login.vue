<template>
  <NuxtLayout name="auth">
    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <h2 class="mb-6 text-center text-lg font-semibold">{{ $t('auth.loginTitle') }}</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="text-sm font-medium" for="email">{{ $t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            :placeholder="$t('auth.email')"
          />
        </div>
        <div>
          <label class="text-sm font-medium" for="password">{{ $t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </div>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isLoading ? $t('app.loading') : $t('auth.loginButton') }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-muted-foreground">
        {{ $t('auth.noAccount') }}
        <NuxtLink to="/register" class="text-primary hover:underline">{{ $t('auth.createAccount') }}</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signIn } from '~/app/lib/firebase/auth'

definePageMeta({ layout: false })

const { t } = useI18n()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  isLoading.value = true
  try {
    await signIn(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.code === 'auth/invalid-credential'
      ? t('auth.errors.wrongPassword')
      : t('app.error')
  } finally {
    isLoading.value = false
  }
}
</script>

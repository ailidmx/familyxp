<template>
  <NuxtLayout name="auth">
    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <h2 class="mb-6 text-center text-lg font-semibold">{{ $t('auth.registerTitle') }}</h2>

      <!-- Indicateur d'étape -->
      <div class="mb-6 flex items-center justify-center gap-2">
        <span
          v-for="step in 2"
          :key="step"
          class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
          :class="currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
        >
          {{ step }}
        </span>
        <span v-if="step === 1" class="text-xs text-muted-foreground">—</span>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- ═══ ÉTAPE 1 : Infos de base ═══ -->
        <template v-if="currentStep === 1">
          <div>
            <label class="text-sm font-medium" for="name">{{ $t('auth.displayName') }}</label>
            <input
              id="name"
              v-model="form.displayName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              :placeholder="$t('auth.displayName')"
            />
          </div>

          <div>
            <label class="text-sm font-medium" for="email">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              :placeholder="$t('auth.email')"
            />
          </div>

          <div>
            <label class="text-sm font-medium" for="password">{{ $t('auth.password') }}</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              autocomplete="new-password"
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label class="text-sm font-medium" for="birthDate">{{ $t('auth.birthDate') }}</label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              required
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p class="mt-1 text-xs text-muted-foreground">{{ $t('auth.birthDateHelp') }}</p>
          </div>

          <button
            type="button"
            class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            @click="goToStep2"
          >
            {{ $t('app.next') }}
          </button>
        </template>

        <!-- ═══ ÉTAPE 2 : Statut et référent ═══ -->
        <template v-if="currentStep === 2">
          <!-- Message si mineur détecté -->
          <div
            v-if="isMinor"
            class="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200"
          >
            <p class="font-medium">{{ $t('auth.minorDetected') }}</p>
            <p class="mt-1">{{ $t('auth.minorHelp') }}</p>
          </div>

          <!-- Message si adulte -->
          <div
            v-else
            class="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200"
          >
            <p class="font-medium">{{ $t('auth.adultDetected') }}</p>
            <p class="mt-1">{{ $t('auth.adultHelp') }}</p>
          </div>

          <!-- Email du référent (obligatoire si mineur) -->
          <div v-if="isMinor">
            <label class="text-sm font-medium" for="guardianEmail">
              {{ $t('auth.guardianEmail') }}
              <span class="text-destructive">*</span>
            </label>
            <input
              id="guardianEmail"
              v-model="form.guardianEmail"
              type="email"
              required
              autocomplete="email"
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              :placeholder="$t('auth.guardianEmailPlaceholder')"
            />
            <p class="mt-1 text-xs text-muted-foreground">{{ $t('auth.guardianEmailHelp') }}</p>
          </div>

          <!-- Avatar ludique (sélecteur visuel) -->
          <AvatarPicker
            :age="age"
            @select="form.avatarId = $event"
          />

          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              @click="currentStep = 1"
            >
              {{ $t('app.back') }}
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {{ isLoading ? $t('app.loading') : $t('auth.registerButton') }}
            </button>
          </div>
        </template>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        {{ $t('auth.hasAccount') }}
        <NuxtLink to="/login" class="text-primary hover:underline">{{ $t('auth.login') }}</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { signUp } from '~/app/lib/firebase/auth'

definePageMeta({ layout: false })

const { t } = useI18n()
const router = useRouter()

const currentStep = ref(1)
const isLoading = ref(false)
const error = ref('')

const form = ref({
  displayName: '',
  email: '',
  password: '',
  birthDate: '',
  guardianEmail: '',
  avatarId: '',
})

// Calcul de l'âge et statut mineur
const birthDateObj = computed(() => {
  if (!form.value.birthDate) return null
  const [y, m, d] = form.value.birthDate.split('-').map(Number)
  return new Date(y, m - 1, d)
})

const age = computed(() => {
  if (!birthDateObj.value) return 0
  const today = new Date()
  let age = today.getFullYear() - birthDateObj.value.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.value.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.value.getDate())) {
    age--
  }
  return age
})

const isMinor = computed(() => age.value < 18)

const avatarInitials = computed(() => {
  return form.value.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'
})

function goToStep2() {
  // Validation basique étape 1
  if (!form.value.displayName || !form.value.email || !form.value.password || !form.value.birthDate) {
    error.value = t('auth.errors.required')
    return
  }
  if (form.value.password.length < 6) {
    error.value = t('auth.errors.weakPassword')
    return
  }
  error.value = ''
  currentStep.value = 2
}

async function handleRegister() {
  error.value = ''
  isLoading.value = true

  try {
    await signUp(form.value.email, form.value.password, form.value.displayName, {
      birthDate: birthDateObj.value ?? undefined,
      guardianEmail: isMinor.value ? form.value.guardianEmail : undefined,
      avatarId: form.value.avatarId || undefined,
    })
    router.push('/')
  } catch (e: any) {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': t('auth.errors.emailInUse'),
      'auth/weak-password': t('auth.errors.weakPassword'),
      'auth/invalid-email': t('auth.errors.invalidEmail'),
    }
    error.value = messages[e.code] || t('app.error')
  } finally {
    isLoading.value = false
  }
}
</script>

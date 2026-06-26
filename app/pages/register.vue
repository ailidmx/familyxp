<template>
  <NuxtLayout name="auth">
    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <h2 class="mb-6 text-center text-lg font-semibold">Inscription</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="text-sm font-medium" for="name">Nom d'affichage</label>
          <input
            id="name"
            v-model="displayName"
            type="text"
            required
            class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Prénom"
          />
        </div>
        <div>
          <label class="text-sm font-medium" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="exemple@email.com"
          />
        </div>
        <div>
          <label class="text-sm font-medium" for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
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
          {{ isLoading ? 'Inscription...' : 'Créer mon compte' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-muted-foreground">
        Déjà un compte ?
        <NuxtLink to="/login" class="text-primary hover:underline">Se connecter</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signUp } from '~/app/lib/firebase/auth'

definePageMeta({ layout: false })

const router = useRouter()
const displayName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleRegister() {
  error.value = ''
  isLoading.value = true
  try {
    await signUp(email.value, password.value, displayName.value)
    router.push('/')
  } catch (e: any) {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/weak-password': 'Le mot de passe doit faire au moins 6 caractères',
      'auth/invalid-email': 'Email invalide',
    }
    error.value = messages[e.code] || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>

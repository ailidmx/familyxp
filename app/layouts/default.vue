<template>
  <div class="min-h-screen bg-background">
    <header v-if="authStore.isAuthenticated" class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-primary">
          <span class="text-xl">⭐</span>
          <span>FamilyXP</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted-foreground">{{ authStore.displayName }}</span>
          <button @click="handleLogout" class="text-sm text-muted-foreground hover:text-foreground">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-lg px-4 py-6">
      <slot />
    </main>
    <nav v-if="authStore.isAuthenticated" class="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div class="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <span>🏠</span>
          <span>Accueil</span>
        </NuxtLink>
        <NuxtLink to="/household" class="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <span>👨‍👩‍👧‍👦</span>
          <span>Foyers</span>
        </NuxtLink>
        <NuxtLink to="/points/history" class="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <span>📊</span>
          <span>Points</span>
        </NuxtLink>
        <NuxtLink to="/rewards" class="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <span>🎁</span>
          <span>Récompenses</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/app/stores/authStore'
import { logOut } from '~/app/lib/firebase/auth'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await logOut()
  router.push('/login')
}
</script>

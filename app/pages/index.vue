<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="authStore.isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="text-4xl">⏳</div>
        <p class="mt-2 text-sm text-muted-foreground">{{ $t('app.loading') }}</p>
      </div>
    </div>

    <!-- No household yet -->
    <div v-else-if="householdStore.households.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">🏠</div>
      <h2 class="text-lg font-semibold">{{ $t('app.welcome') }}</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        {{ $t('household.createFirst') }}
      </p>
      <NuxtLink
        to="/household/create"
        class="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {{ $t('household.create') }}
      </NuxtLink>
    </div>

    <!-- Dashboard -->
    <div v-else>
      <!-- Household selector -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          v-for="household in householdStore.households"
          :key="household.id"
          @click="householdStore.setCurrentHousehold(household.id)"
          :class="[
            'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
            household.id === householdStore.currentHouseholdId
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          ]"
        >
          {{ household.name }}
        </button>
      </div>

      <!-- Current household dashboard -->
      <div v-if="currentMembership" class="space-y-6">
        <!-- Points card -->
        <div class="rounded-lg border bg-card p-6 shadow-sm">
          <div class="text-center">
            <p class="text-sm text-muted-foreground">{{ $t('dashboard.myPoints') }}</p>
            <p class="text-4xl font-bold text-primary">{{ currentMembership.points }}</p>
            <p class="text-xs text-muted-foreground mt-1">XP</p>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            to="/points/add"
            class="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm hover:bg-accent transition-colors"
          >
            <span class="text-2xl">➕</span>
            <span class="text-sm font-medium">{{ $t('points.add') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/rewards"
            class="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm hover:bg-accent transition-colors"
          >
            <span class="text-2xl">🎁</span>
            <span class="text-sm font-medium">{{ $t('nav.rewards') }}</span>
          </NuxtLink>
        </div>

        <!-- Recent activity -->
        <div>
          <h3 class="text-sm font-semibold mb-3">{{ $t('dashboard.recentActivity') }}</h3>
          <div class="space-y-2">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm"
            >
              <span class="text-lg">📌</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ $t('dashboard.recentActivity') }}</p>
                <p class="text-xs text-muted-foreground">{{ $t('points.noHistory') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '~/app/stores/authStore'
import { useHouseholdStore } from '~/app/stores/householdStore'

const authStore = useAuthStore()
const householdStore = useHouseholdStore()

const currentMembership = computed(() => householdStore.currentMembership)

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await householdStore.loadHouseholds()
  }
})
</script>

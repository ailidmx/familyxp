<template>
  <div class="space-y-6">
    <!-- Welcome -->
    <div>
      <h1 class="text-lg font-semibold">{{ $t('dashboard.welcome', { name: userName }) }}</h1>
      <p v-if="householdStore.currentHouseholdName" class="text-sm text-muted-foreground">
        {{ householdStore.currentHouseholdName }}
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="text-sm text-muted-foreground">{{ $t('app.loading') }}</span>
    </div>

    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- My Points -->
    <section v-if="myBalance !== null" class="rounded-lg border bg-card p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">{{ $t('dashboard.myPoints') }}</span>
        <span class="text-2xl font-bold" :class="myBalance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ myBalance > 0 ? '+' : '' }}{{ myBalance }}
        </span>
      </div>
    </section>

    <!-- Next Reward -->
    <section v-if="nextReward" class="rounded-lg border bg-card p-4">
      <h2 class="text-sm font-medium mb-2">{{ $t('dashboard.nextReward') }}</h2>
      <div class="flex items-center justify-between">
        <span class="text-sm">{{ nextReward.name }}</span>
        <span class="text-sm text-muted-foreground">{{ nextReward.pointsCost }} pts</span>
      </div>
      <div class="mt-2 h-2 w-full rounded-full bg-secondary">
        <div
          class="h-2 rounded-full bg-primary transition-all"
          :style="{ width: rewardProgress + '%' }"
        />
      </div>
    </section>

    <!-- Quick Actions -->
    <section>
      <h2 class="text-sm font-medium mb-3">{{ $t('dashboard.quickActions') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink
          to="/points"
          class="flex flex-col items-center gap-1 rounded-lg border bg-card p-4 text-center hover:bg-accent"
        >
          <span class="text-lg">⭐</span>
          <span class="text-xs font-medium">{{ $t('points.add') }}</span>
        </NuxtLink>
        <NuxtLink
          to="/contract"
          class="flex flex-col items-center gap-1 rounded-lg border bg-card p-4 text-center hover:bg-accent"
        >
          <span class="text-lg">📋</span>
          <span class="text-xs font-medium">{{ $t('contract.title') }}</span>
        </NuxtLink>
        <NuxtLink
          to="/validation"
          class="flex flex-col items-center gap-1 rounded-lg border bg-card p-4 text-center hover:bg-accent"
        >
          <span class="text-lg">✅</span>
          <span class="text-xs font-medium">{{ $t('validation.title') }}</span>
          <span v-if="pendingCount > 0" class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground">
            {{ pendingCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          to="/rewards"
          class="flex flex-col items-center gap-1 rounded-lg border bg-card p-4 text-center hover:bg-accent"
        >
          <span class="text-lg">🎁</span>
          <span class="text-xs font-medium">{{ $t('rewards.title') }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Active Contract Rules -->
    <section v-if="contractStore.hasActiveContract">
      <h2 class="text-sm font-medium mb-3">{{ $t('contract.title') }}</h2>
      <div class="space-y-2">
        <div v-for="rule in contractStore.bonusRules.slice(0, 5)" :key="rule.id" class="flex items-center justify-between rounded-lg border bg-card p-3">
          <div class="flex items-center gap-2">
            <span class="text-green-600 text-sm">+{{ rule.points }}</span>
            <span class="text-sm">{{ rule.name }}</span>
          </div>
          <span class="text-xs text-muted-foreground">{{ $t(`rules.categories.${rule.category}`) }}</span>
        </div>
        <div v-for="rule in contractStore.malusRules.slice(0, 5)" :key="rule.id" class="flex items-center justify-between rounded-lg border bg-card p-3">
          <div class="flex items-center gap-2">
            <span class="text-red-600 text-sm">-{{ rule.points }}</span>
            <span class="text-sm">{{ rule.name }}</span>
          </div>
          <span class="text-xs text-muted-foreground">{{ $t(`rules.categories.${rule.category}`) }}</span>
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section>
      <h2 class="text-sm font-medium mb-3">{{ $t('dashboard.recentActivity') }}</h2>
      <div v-if="pointStore.recentEvents.length === 0" class="text-center py-6 text-sm text-muted-foreground">
        {{ $t('points.noHistory') }}
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="event in pointStore.recentEvents.slice(0, 5)"
          :key="event.id"
          class="flex items-center justify-between rounded-lg border bg-card p-3"
        >
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              :class="event.type === 'bonus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ event.type === 'bonus' ? '+' : '-' }}{{ event.points }}
            </span>
            <span class="text-sm">{{ event.reason }}</span>
          </div>
          <span class="text-xs text-muted-foreground">{{ formatRelativeTime(event.createdAt) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'
import { usePointStore } from '~/app/stores/pointStore'
import { useContractStore } from '~/app/stores/contractStore'
import { useAuthStore } from '~/app/stores/authStore'
import { formatRelativeTime } from '~/app/utils/format'

definePageMeta({ middleware: 'auth' })

const householdStore = useHouseholdStore()
const pointStore = usePointStore()
const contractStore = useContractStore()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const myBalance = ref<number | null>(null)
const nextReward = ref<{ name: string; pointsCost: number } | null>(null)
const rewardProgress = ref(0)
const pendingCount = ref(0)

const userName = computed(() => authStore.user?.displayName || authStore.user?.email || '')

onMounted(async () => {
  if (!householdStore.currentHouseholdId) {
    loading.value = false
    return
  }

  try {
    await Promise.all([
      pointStore.loadEvents(householdStore.currentHouseholdId),
      contractStore.loadContracts(householdStore.currentHouseholdId),
    ])

    if (authStore.user?.uid) {
      myBalance.value = await pointStore.getMemberBalance(
        householdStore.currentHouseholdId,
        authStore.user.uid
      )
    }

    pendingCount.value = pointStore.pendingValidations.length

    // Find next achievable reward
    if (contractStore.currentContract?.rewards && myBalance.value !== null) {
      const sorted = [...contractStore.currentContract.rewards]
        .filter((r) => r.isActive)
        .sort((a, b) => a.pointsCost - b.pointsCost)
      const next = sorted.find((r) => r.pointsCost > (myBalance.value || 0))
      if (next) {
        nextReward.value = next
        rewardProgress.value = Math.min(100, ((myBalance.value || 0) / next.pointsCost) * 100)
      } else if (sorted.length > 0) {
        nextReward.value = sorted[sorted.length - 1]
        rewardProgress.value = 100
      }
    }
  } catch (e: any) {
    error.value = e.message || ''
  } finally {
    loading.value = false
  }
})
</script>

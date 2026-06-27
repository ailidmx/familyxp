<template>
  <div class="space-y-6">
    <h1 class="text-lg font-semibold">{{ $t('points.title') }}</h1>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <span class="text-sm text-muted-foreground">{{ $t('app.loading') }}</span>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- Leaderboard -->
    <section v-if="leaderboard.length > 0">
      <h2 class="text-base font-medium mb-3">{{ $t('points.leaderboard') }}</h2>
      <div class="space-y-2">
        <div
          v-for="(entry, index) in leaderboard"
          :key="entry.memberId"
          class="flex items-center justify-between rounded-lg border bg-card p-3"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold text-muted-foreground w-6">#{{ index + 1 }}</span>
            <AvatarDisplay
              :avatar-id="getMemberAvatar(entry.memberId)"
              :display-name="getMemberName(entry.memberId)"
              class="h-8 w-8"
            />
            <span class="text-sm font-medium">{{ getMemberName(entry.memberId) }}</span>
          </div>
          <span class="text-sm font-semibold" :class="entry.balance >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ entry.balance > 0 ? '+' : '' }}{{ entry.balance }}
          </span>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <div class="flex gap-3">
      <button
        @click="showAddModal = true"
        class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {{ $t('points.add') }}
      </button>
      <button
        @click="showRemoveModal = true"
        class="flex-1 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
      >
        {{ $t('points.remove') }}
      </button>
    </div>

    <!-- Recent History -->
    <section>
      <h2 class="text-base font-medium mb-3">{{ $t('points.history') }}</h2>
      <div v-if="pointStore.recentEvents.length === 0" class="text-center py-6 text-sm text-muted-foreground">
        {{ $t('points.noHistory') }}
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="event in pointStore.recentEvents"
          :key="event.id"
          class="rounded-lg border bg-card p-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :class="event.type === 'bonus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ event.type === 'bonus' ? '+' : '-' }}{{ event.points }}
              </span>
              <span class="text-sm">{{ event.reason }}</span>
            </div>
            <span
              class="text-xs"
              :class="{
                'text-yellow-600': event.status === 'pending',
                'text-green-600': event.status === 'approved',
                'text-red-600': event.status === 'rejected',
              }"
            >
              {{ $t(`validation.${event.status}`) }}
            </span>
          </div>
          <div class="mt-1 text-xs text-muted-foreground">
            {{ getMemberName(event.memberId) }} · {{ formatRelativeTime(event.createdAt) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Add Points Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showAddModal = false">
        <div class="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
          <h3 class="text-base font-semibold mb-4">{{ $t('points.add') }}</h3>
          <form @submit.prevent="handleAddPoints" class="space-y-3">
            <div>
              <label class="text-sm font-medium">{{ $t('points.member') }}</label>
              <select v-model="addMemberId" required class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="" disabled>{{ $t('household.select') }}</option>
                <option v-for="m in members" :key="m.userId" :value="m.userId">{{ m.displayName || m.userId }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">{{ $t('rules.title') }}</label>
              <select v-model="addRuleId" class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">{{ $t('rules.title') }}</option>
                <option v-for="r in bonusRules" :key="r.id" :value="r.id">{{ r.name }} (+{{ r.points }})</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">{{ $t('points.amount') }}</label>
              <input v-model.number="addPoints" type="number" min="1" required class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-sm font-medium">{{ $t('points.reason') }}</label>
              <input v-model="addReason" required class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div class="flex gap-2 pt-2">
              <button type="button" @click="showAddModal = false" class="flex-1 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">{{ $t('app.cancel') }}</button>
              <button type="submit" class="flex-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">{{ $t('points.add') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Remove Points Modal -->
    <Teleport to="body">
      <div v-if="showRemoveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showRemoveModal = false">
        <div class="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
          <h3 class="text-base font-semibold mb-4">{{ $t('points.remove') }}</h3>
          <form @submit.prevent="handleRemovePoints" class="space-y-3">
            <div>
              <label class="text-sm font-medium">{{ $t('points.member') }}</label>
              <select v-model="removeMemberId" required class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="" disabled>{{ $t('household.select') }}</option>
                <option v-for="m in members" :key="m.userId" :value="m.userId">{{ m.displayName || m.userId }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">{{ $t('rules.title') }}</label>
              <select v-model="removeRuleId" class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">{{ $t('rules.title') }}</option>
                <option v-for="r in malusRules" :key="r.id" :value="r.id">{{ r.name }} (-{{ r.points }})</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">{{ $t('points.amount') }}</label>
              <input v-model.number="removePoints" type="number" min="1" required class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-sm font-medium">{{ $t('points.reason') }}</label>
              <input v-model="removeReason" required class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div class="flex gap-2 pt-2">
              <button type="button" @click="showRemoveModal = false" class="flex-1 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">{{ $t('app.cancel') }}</button>
              <button type="submit" class="flex-1 rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground hover:bg-destructive/90">{{ $t('points.remove') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'
import { usePointStore } from '~/app/stores/pointStore'
import { useContractStore } from '~/app/stores/contractStore'
import { formatRelativeTime } from '~/app/utils/format'

definePageMeta({ middleware: 'auth' })

const householdStore = useHouseholdStore()
const pointStore = usePointStore()
const contractStore = useContractStore()

const showAddModal = ref(false)
const showRemoveModal = ref(false)
const addMemberId = ref('')
const addRuleId = ref('')
const addPoints = ref(5)
const addReason = ref('')
const removeMemberId = ref('')
const removeRuleId = ref('')
const removePoints = ref(5)
const removeReason = ref('')
const error = ref('')
const loading = ref(true)
const leaderboard = ref<{ memberId: string; balance: number }[]>([])

const members = computed(() => householdStore.currentMembers || [])
const bonusRules = computed(() => contractStore.bonusRules)
const malusRules = computed(() => contractStore.malusRules)

function getMemberName(memberId: string): string {
  const member = members.value.find((m) => m.userId === memberId)
  return member?.displayName || memberId
}

function getMemberAvatar(memberId: string): string | undefined {
  const member = members.value.find((m) => m.userId === memberId)
  return member?.avatarId
}

onMounted(async () => {
  if (householdStore.currentHouseholdId) {
    await Promise.all([
      pointStore.loadEvents(householdStore.currentHouseholdId),
      contractStore.loadContracts(householdStore.currentHouseholdId),
    ])
    leaderboard.value = await pointStore.getLeaderboard(householdStore.currentHouseholdId)
  }
  loading.value = false
})

async function handleAddPoints() {
  if (!householdStore.currentHouseholdId || !contractStore.currentContract) return
  error.value = ''
  try {
    await pointStore.addPoints(
      householdStore.currentHouseholdId,
      contractStore.currentContract.id,
      addRuleId.value || undefined,
      addMemberId.value,
      addPoints.value,
      addReason.value
    )
    showAddModal.value = false
    addMemberId.value = ''
    addRuleId.value = ''
    addPoints.value = 5
    addReason.value = ''
    leaderboard.value = await pointStore.getLeaderboard(householdStore.currentHouseholdId)
  } catch (e: any) {
    error.value = e.message || ''
  }
}

async function handleRemovePoints() {
  if (!householdStore.currentHouseholdId || !contractStore.currentContract) return
  error.value = ''
  try {
    await pointStore.removePoints(
      householdStore.currentHouseholdId,
      contractStore.currentContract.id,
      removeRuleId.value || undefined,
      removeMemberId.value,
      removePoints.value,
      removeReason.value
    )
    showRemoveModal.value = false
    removeMemberId.value = ''
    removeRuleId.value = ''
    removePoints.value = 5
    removeReason.value = ''
    leaderboard.value = await pointStore.getLeaderboard(householdStore.currentHouseholdId)
  } catch (e: any) {
    error.value = e.message || ''
  }
}
</script>

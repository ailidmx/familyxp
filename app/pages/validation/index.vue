<template>
  <div class="space-y-6">
    <h1 class="text-lg font-semibold">{{ $t('validation.title') }}</h1>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="text-sm text-muted-foreground">{{ $t('app.loading') }}</span>
    </div>

    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

    <div v-if="!loading && pendingEvents.length === 0" class="text-center py-12">
      <p class="text-sm text-muted-foreground">{{ $t('validation.noPending') }}</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="event in pendingEvents"
        :key="event.id"
        class="rounded-lg border bg-card p-4"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <AvatarDisplay
                :avatar-id="getMemberAvatar(event.memberId)"
                :display-name="getMemberName(event.memberId)"
                class="h-8 w-8"
              />
              <span class="text-sm font-medium">{{ getMemberName(event.memberId) }}</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ event.reason }}</p>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :class="event.type === 'bonus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ event.type === 'bonus' ? '+' : '-' }}{{ event.points }}
              </span>
              <span>{{ formatRelativeTime(event.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <button
            @click="handleApprove(event.id)"
            :disabled="validatingId === event.id"
            class="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {{ $t('validation.approve') }}
          </button>
          <button
            @click="handleReject(event.id)"
            :disabled="validatingId === event.id"
            class="flex-1 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {{ $t('validation.reject') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'
import { usePointStore } from '~/app/stores/pointStore'
import { useAuthStore } from '~/app/stores/authStore'
import { formatRelativeTime } from '~/app/utils/format'

definePageMeta({ middleware: 'auth' })

const householdStore = useHouseholdStore()
const pointStore = usePointStore()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const validatingId = ref('')

const pendingEvents = computed(() => pointStore.pendingValidations)

const members = computed(() => householdStore.currentMembers || [])

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
    await pointStore.loadEvents(householdStore.currentHouseholdId)
  }
  loading.value = false
})

async function handleApprove(eventId: string) {
  if (!authStore.user?.uid) return
  validatingId.value = eventId
  error.value = ''
  try {
    await pointStore.validateEvent(eventId, authStore.user.uid, 'approved')
  } catch (e: any) {
    error.value = e.message || ''
  } finally {
    validatingId.value = ''
  }
}

async function handleReject(eventId: string) {
  if (!authStore.user?.uid) return
  validatingId.value = eventId
  error.value = ''
  try {
    await pointStore.validateEvent(eventId, authStore.user.uid, 'rejected')
  } catch (e: any) {
    error.value = e.message || ''
  } finally {
    validatingId.value = ''
  }
}
</script>

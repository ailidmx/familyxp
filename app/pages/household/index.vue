<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">{{ $t('household.title') }}</h1>
      <NuxtLink
        to="/household/create"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        + {{ $t('household.create') }}
      </NuxtLink>
    </div>

    <div v-if="householdStore.isLoading" class="text-center py-12">
      <p class="text-sm text-muted-foreground">{{ $t('app.loading') }}</p>
    </div>

    <div v-else-if="householdStore.households.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">🏠</div>
      <p class="text-sm text-muted-foreground">{{ $t('household.noHouseholds') }}</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="household in householdStore.households"
        :key="household.id"
        class="rounded-lg border bg-card p-4 shadow-sm hover:bg-accent transition-colors cursor-pointer"
        @click="selectHousehold(household.id)"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">{{ household.name }}</h3>
            <p v-if="household.description" class="text-sm text-muted-foreground">
              {{ household.description }}
            </p>
          </div>
          <span class="text-sm text-muted-foreground">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHouseholdStore } from '~/app/stores/householdStore'

const householdStore = useHouseholdStore()
const router = useRouter()

onMounted(async () => {
  await householdStore.loadHouseholds()
})

function selectHousehold(id: string) {
  householdStore.setCurrentHousehold(id)
  router.push('/')
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <!-- Loading state -->
    <div v-if="store.isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="text-4xl">⏳</div>
        <p class="mt-2 text-sm text-muted-foreground">{{ $t('app.loading') }}</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="store.error" class="text-center py-12">
      <div class="text-4xl mb-4">😕</div>
      <p class="text-sm text-destructive">{{ store.error }}</p>
      <button
        class="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        @click="loadContract"
      >
        {{ $t('app.retry') }}
      </button>
    </div>

    <!-- Contract detail -->
    <template v-else-if="contract">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button
          class="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
          @click="goBack"
        >
          ← {{ $t('app.back') }}
        </button>
        <div class="flex items-center gap-2">
          <span
            :class="[
              'rounded-full px-3 py-0.5 text-xs font-medium',
              statusBadgeClass
            ]"
          >
            {{ statusLabel }}
          </span>
        </div>
      </div>

      <!-- Contract info card -->
      <div class="rounded-lg border bg-card p-4 shadow-sm">
        <h1 class="text-xl font-bold">{{ contract.name }}</h1>
        <p v-if="contract.description" class="mt-1 text-sm text-muted-foreground">
          {{ contract.description }}
        </p>
        <div class="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>📅 {{ $t('contract.startDate') }} : {{ formatDate(contract.startDate) }}</span>
          <span v-if="contract.endDate">
            → {{ $t('contract.endDate') }} : {{ formatDate(contract.endDate) }}
          </span>
        </div>
      </div>

      <!-- Activate button (only if draft) -->
      <button
        v-if="store.isDraft"
        class="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        @click="handleActivate"
      >
        ✅ Activer le contrat
      </button>

      <!-- Bonus rules section -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold">⭐ {{ $t('rules.bonus') }}</h2>
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            @click="openRuleModal('bonus')"
          >
            + {{ $t('rules.create') }}
          </button>
        </div>

        <div v-if="store.bonusRules.length === 0" class="rounded-lg border border-dashed p-6 text-center">
          <p class="text-sm text-muted-foreground">Aucune règle bonus</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="rule in store.bonusRules"
            :key="rule.id"
            class="rounded-lg border bg-card p-3 shadow-sm"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium truncate">{{ rule.name }}</span>
                  <span class="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                    +{{ rule.points }}
                  </span>
                </div>
                <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>{{ categoryLabel(rule.category) }}</span>
                  <span>{{ frequencyLabel(rule.frequency) }}</span>
                  <span v-if="rule.requiresValidation">🔒 Validation requise</span>
                </div>
              </div>
              <div class="flex shrink-0 gap-1">
                <button
                  class="rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  @click="openRuleModal('bonus', rule)"
                  :title="$t('app.edit')"
                >
                  ✏️
                </button>
                <button
                  class="rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-destructive"
                  @click="handleDeleteRule(rule.id)"
                  :title="$t('app.delete')"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Malus rules section -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold">⚠️ {{ $t('rules.malus') }}</h2>
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            @click="openRuleModal('malus')"
          >
            + {{ $t('rules.create') }}
          </button>
        </div>

        <div v-if="store.malusRules.length === 0" class="rounded-lg border border-dashed p-6 text-center">
          <p class="text-sm text-muted-foreground">Aucune règle malus</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="rule in store.malusRules"
            :key="rule.id"
            class="rounded-lg border bg-card p-3 shadow-sm"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium truncate">{{ rule.name }}</span>
                  <span class="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                    -{{ rule.points }}
                  </span>
                </div>
                <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>{{ categoryLabel(rule.category) }}</span>
                  <span>{{ frequencyLabel(rule.frequency) }}</span>
                  <span v-if="rule.requiresValidation">🔒 Validation requise</span>
                </div>
              </div>
              <div class="flex shrink-0 gap-1">
                <button
                  class="rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  @click="openRuleModal('malus', rule)"
                  :title="$t('app.edit')"
                >
                  ✏️
                </button>
                <button
                  class="rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-destructive"
                  @click="handleDeleteRule(rule.id)"
                  :title="$t('app.delete')"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Rewards section -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold">🎁 {{ $t('contract.rewards') }}</h2>
          <button
            class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            @click="openRewardModal()"
          >
            + {{ $t('rewards.create') }}
          </button>
        </div>

        <div v-if="(contract.rewards || []).length === 0" class="rounded-lg border border-dashed p-6 text-center">
          <p class="text-sm text-muted-foreground">{{ $t('rewards.noRewards') }}</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="reward in contract.rewards"
            :key="reward.id"
            class="rounded-lg border bg-card p-3 shadow-sm"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium truncate">{{ reward.name }}</span>
                  <span class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    {{ reward.pointsCost }} XP
                  </span>
                </div>
                <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>{{ rewardCategoryLabel(reward.category) }}</span>
                  <span v-if="reward.stock !== undefined && reward.stock !== null">
                    📦 x{{ reward.stock }}
                  </span>
                </div>
              </div>
              <div class="flex shrink-0 gap-1">
                <button
                  class="rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  @click="openRewardModal(reward)"
                  :title="$t('app.edit')"
                >
                  ✏️
                </button>
                <button
                  class="rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-destructive"
                  @click="handleDeleteReward(reward.id)"
                  :title="$t('app.delete')"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ─── Rule Modal ──────────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showRuleModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
        @click.self="closeRuleModal"
      >
        <div class="w-full max-w-lg rounded-t-xl sm:rounded-xl bg-background p-5 shadow-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold">
              {{ editingRule ? $t('rules.edit') : $t('rules.create') }}
            </h3>
            <button
              class="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              @click="closeRuleModal"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="handleSaveRule" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="text-sm font-medium" for="rule-name">{{ $t('rules.name') }}</label>
              <input
                id="rule-name"
                v-model="ruleForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                :placeholder="$t('rules.name')"
              />
            </div>

            <!-- Type (hidden when editing, shown when creating) -->
            <div v-if="!editingRule">
              <label class="text-sm font-medium">Type</label>
              <div class="mt-1 flex gap-2">
                <button
                  type="button"
                  :class="[
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                    ruleForm.type === 'bonus'
                      ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : 'border-input bg-background text-muted-foreground hover:bg-accent'
                  ]"
                  @click="ruleForm.type = 'bonus'"
                >
                  ⭐ {{ $t('rules.bonus') }}
                </button>
                <button
                  type="button"
                  :class="[
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                    ruleForm.type === 'malus'
                      ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'border-input bg-background text-muted-foreground hover:bg-accent'
                  ]"
                  @click="ruleForm.type = 'malus'"
                >
                  ⚠️ {{ $t('rules.malus') }}
                </button>
              </div>
            </div>

            <!-- Points -->
            <div>
              <label class="text-sm font-medium" for="rule-points">{{ $t('rules.points') }}</label>
              <input
                id="rule-points"
                v-model.number="ruleForm.points"
                type="number"
                required
                min="1"
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="text-sm font-medium" for="rule-category">{{ $t('rules.category') }}</label>
              <select
                id="rule-category"
                v-model="ruleForm.category"
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="chores">{{ $t('rules.categories.chores') }}</option>
                <option value="school">{{ $t('rules.categories.homework') }}</option>
                <option value="behavior">{{ $t('rules.categories.behavior') }}</option>
                <option value="health">{{ $t('rules.categories.hygiene') }}</option>
                <option value="custom">{{ $t('rules.categories.other') }}</option>
              </select>
            </div>

            <!-- Frequency -->
            <div>
              <label class="text-sm font-medium" for="rule-frequency">{{ $t('rules.frequency') }}</label>
              <select
                id="rule-frequency"
                v-model="ruleForm.frequency"
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="daily">{{ $t('rules.frequency.daily') }}</option>
                <option value="weekly">{{ $t('rules.frequency.weekly') }}</option>
                <option value="monthly">{{ $t('rules.frequency.monthly') }}</option>
                <option value="once">{{ $t('rules.frequency.once') }}</option>
              </select>
            </div>

            <!-- Requires validation -->
            <div class="flex items-center gap-2">
              <input
                id="rule-validation"
                v-model="ruleForm.requiresValidation"
                type="checkbox"
                class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label class="text-sm font-medium" for="rule-validation">
                Validation requise
              </label>
            </div>

            <!-- Error -->
            <p v-if="ruleError" class="text-sm text-destructive">{{ ruleError }}</p>

            <!-- Actions -->
            <div class="flex gap-2 pt-2">
              <button
                type="button"
                class="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                @click="closeRuleModal"
              >
                {{ $t('app.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="ruleSaving"
                class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {{ ruleSaving ? $t('app.loading') : $t('app.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ─── Reward Modal ────────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showRewardModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
        @click.self="closeRewardModal"
      >
        <div class="w-full max-w-lg rounded-t-xl sm:rounded-xl bg-background p-5 shadow-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold">
              {{ editingReward ? $t('rewards.edit') : $t('rewards.create') }}
            </h3>
            <button
              class="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              @click="closeRewardModal"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="handleSaveReward" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="text-sm font-medium" for="reward-name">{{ $t('rewards.name') }}</label>
              <input
                id="reward-name"
                v-model="rewardForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                :placeholder="$t('rewards.name')"
              />
            </div>

            <!-- Points cost -->
            <div>
              <label class="text-sm font-medium" for="reward-cost">{{ $t('rewards.cost') }}</label>
              <input
                id="reward-cost"
                v-model.number="rewardForm.pointsCost"
                type="number"
                required
                min="1"
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="text-sm font-medium" for="reward-category">Catégorie</label>
              <select
                id="reward-category"
                v-model="rewardForm.category"
                required
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="screen_time">{{ $t('rewards.category.screenTime') }}</option>
                <option value="activity">{{ $t('rewards.category.activity') }}</option>
                <option value="treat">{{ $t('rewards.category.treat') }}</option>
                <option value="money">{{ $t('rewards.category.outing') }}</option>
                <option value="custom">{{ $t('rewards.category.other') }}</option>
              </select>
            </div>

            <!-- Stock -->
            <div>
              <label class="text-sm font-medium" for="reward-stock">
                Stock
                <span class="text-xs text-muted-foreground">(optionnel)</span>
              </label>
              <input
                id="reward-stock"
                v-model.number="rewardForm.stock"
                type="number"
                min="0"
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Stock disponible"
              />
            </div>

            <!-- Error -->
            <p v-if="rewardError" class="text-sm text-destructive">{{ rewardError }}</p>

            <!-- Actions -->
            <div class="flex gap-2 pt-2">
              <button
                type="button"
                class="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                @click="closeRewardModal"
              >
                {{ $t('app.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="rewardSaving"
                class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {{ rewardSaving ? $t('app.loading') : $t('app.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContractStore } from '~/app/stores/contractStore'
import { formatDate } from '~/app/utils/format'
import type { RuleType, RuleCategory, RuleFrequency } from '~/app/types'
import type { RewardCategory } from '~/app/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const store = useContractStore()
const { t } = useI18n()

const contractId = computed(() => route.params.id as string)
const contract = computed(() => store.currentContract)

// ─── Status helpers ──────────────────────────────────────────────────────────

const statusLabel = computed(() => {
  if (!contract.value) return ''
  const key = contract.value.status
  return t(`contract.status.${key}`)
})

const statusBadgeClass = computed(() => {
  if (!contract.value) return ''
  switch (contract.value.status) {
    case 'draft':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    case 'paused':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
    case 'archived':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

// ─── Category / Frequency labels ─────────────────────────────────────────────

function categoryLabel(cat: RuleCategory): string {
  const key = `rules.categories.${cat}`
  const label = t(key)
  return label !== key ? label : cat
}

function frequencyLabel(freq: RuleFrequency): string {
  const key = `rules.frequency.${freq}`
  const label = t(key)
  return label !== key ? label : freq
}

function rewardCategoryLabel(cat: RewardCategory): string {
  const key = `rewards.category.${cat}`
  const label = t(key)
  return label !== key ? label : cat
}

// ─── Load ────────────────────────────────────────────────────────────────────

async function loadContract() {
  await store.loadContract(contractId.value)
}

function goBack() {
  router.back()
}

onMounted(() => {
  loadContract()
})

// ─── Activate ────────────────────────────────────────────────────────────────

async function handleActivate() {
  if (!contract.value) return
  await store.activateContract(contract.value.id)
}

// ─── Rule modal state ────────────────────────────────────────────────────────

const showRuleModal = ref(false)
const editingRule = ref<string | null>(null)
const ruleSaving = ref(false)
const ruleError = ref('')

const ruleForm = ref({
  name: '',
  type: 'bonus' as RuleType,
  points: 10,
  category: 'chores' as RuleCategory,
  frequency: 'daily' as RuleFrequency,
  requiresValidation: false,
})

function openRuleModal(type: RuleType, rule?: any) {
  if (rule) {
    editingRule.value = rule.id
    ruleForm.value = {
      name: rule.name,
      type: rule.type,
      points: rule.points,
      category: rule.category,
      frequency: rule.frequency,
      requiresValidation: rule.requiresValidation,
    }
  } else {
    editingRule.value = null
    ruleForm.value = {
      name: '',
      type,
      points: 10,
      category: 'chores',
      frequency: 'daily',
      requiresValidation: false,
    }
  }
  ruleError.value = ''
  showRuleModal.value = true
}

function closeRuleModal() {
  showRuleModal.value = false
  editingRule.value = null
  ruleError.value = ''
}

async function handleSaveRule() {
  ruleError.value = ''
  ruleSaving.value = true
  try {
    if (editingRule.value) {
      await store.updateRule(editingRule.value, {
        name: ruleForm.value.name,
        type: ruleForm.value.type,
        points: ruleForm.value.points,
        category: ruleForm.value.category,
        frequency: ruleForm.value.frequency,
        requiresValidation: ruleForm.value.requiresValidation,
      })
    } else {
      await store.addRule({
        name: ruleForm.value.name,
        type: ruleForm.value.type,
        points: ruleForm.value.points,
        category: ruleForm.value.category,
        frequency: ruleForm.value.frequency,
        requiresValidation: ruleForm.value.requiresValidation,
        isActive: true,
      })
    }
    closeRuleModal()
  } catch (err: any) {
    ruleError.value = err.message || t('app.error')
  } finally {
    ruleSaving.value = false
  }
}

async function handleDeleteRule(ruleId: string) {
  if (!confirm(t('app.confirm') + ' ?')) return
  await store.deleteRule(ruleId)
}

// ─── Reward modal state ──────────────────────────────────────────────────────

const showRewardModal = ref(false)
const editingReward = ref<string | null>(null)
const rewardSaving = ref(false)
const rewardError = ref('')

const rewardForm = ref({
  name: '',
  pointsCost: 50,
  category: 'treat' as RewardCategory,
  stock: undefined as number | undefined,
})

function openRewardModal(reward?: any) {
  if (reward) {
    editingReward.value = reward.id
    rewardForm.value = {
      name: reward.name,
      pointsCost: reward.pointsCost,
      category: reward.category,
      stock: reward.stock,
    }
  } else {
    editingReward.value = null
    rewardForm.value = {
      name: '',
      pointsCost: 50,
      category: 'treat',
      stock: undefined,
    }
  }
  rewardError.value = ''
  showRewardModal.value = true
}

function closeRewardModal() {
  showRewardModal.value = false
  editingReward.value = null
  rewardError.value = ''
}

async function handleSaveReward() {
  rewardError.value = ''
  rewardSaving.value = true
  try {
    if (editingReward.value) {
      await store.updateReward(editingReward.value, {
        name: rewardForm.value.name,
        pointsCost: rewardForm.value.pointsCost,
        category: rewardForm.value.category,
        stock: rewardForm.value.stock,
      })
    } else {
      await store.addReward({
        name: rewardForm.value.name,
        pointsCost: rewardForm.value.pointsCost,
        category: rewardForm.value.category,
        stock: rewardForm.value.stock,
        isActive: true,
      })
    }
    closeRewardModal()
  } catch (err: any) {
    rewardError.value = err.message || t('app.error')
  } finally {
    rewardSaving.value = false
  }
}

async function handleDeleteReward(rewardId: string) {
  if (!confirm(t('app.confirm') + ' ?')) return
  await store.deleteReward(rewardId)
}
</script>

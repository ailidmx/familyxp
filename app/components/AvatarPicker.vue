<template>
  <div>
    <label class="text-sm font-medium">{{ $t('avatar.chooseYourAvatar') }}</label>
    <p class="mt-1 text-xs text-muted-foreground">{{ $t('avatar.pickDescription') }}</p>

    <!-- Aperçu de l'avatar sélectionné -->
    <div class="mt-3 flex items-center gap-4">
      <div
        class="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-md transition-transform hover:scale-105"
        :style="{ backgroundColor: selectedAvatar?.bgColor || '#E0E0E0' }"
      >
        {{ selectedAvatar?.emoji || '❓' }}
      </div>
      <div>
        <p class="font-medium text-sm">
          {{ selectedAvatar ? $t(selectedAvatar.nameKey) : $t('avatar.noneSelected') }}
        </p>
        <p v-if="selectedAvatar" class="text-xs text-muted-foreground mt-0.5">
          {{ $t(`avatar.theme.${selectedAvatar.theme}`) }}
        </p>
      </div>
    </div>

    <!-- Filtres par groupe d'âge -->
    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="group in ageGroups"
        :key="group.key"
        class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
        :class="
          activeAgeGroup === group.key
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        "
        @click="activeAgeGroup = group.key"
      >
        {{ group.emoji }} {{ $t(`avatar.ageGroup.${group.key}`) }}
      </button>
    </div>

    <!-- Grille d'avatars -->
    <div class="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
      <button
        v-for="avatar in filteredAvatars"
        :key="avatar.id"
        class="flex aspect-square items-center justify-center rounded-2xl text-3xl transition-all hover:scale-110 hover:shadow-lg"
        :class="selectedAvatar?.id === avatar.id ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''"
        :style="{ backgroundColor: avatar.bgColor }"
        :title="$t(avatar.nameKey)"
        @click="$emit('select', avatar.id)"
      >
        {{ avatar.emoji }}
      </button>
    </div>

    <!-- Message si aucun avatar filtré -->
    <p v-if="filteredAvatars.length === 0" class="mt-4 text-center text-sm text-muted-foreground">
      {{ $t('avatar.noAvatarsForAge') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AVATARS, getAvatarById, suggestAgeGroup, type Avatar } from '~/app/types/avatar'

const props = defineProps<{
  /** ID de l'avatar actuellement sélectionné */
  modelValue?: string
  /** Âge en années pour suggérer un groupe d'âge */
  age?: number
}>()

defineEmits<{
  select: [avatarId: string]
}>()

const activeAgeGroup = ref<Avatar['ageGroup']>(
  props.age ? suggestAgeGroup(props.age) : 'child'
)

const selectedAvatar = computed(() => {
  if (!props.modelValue) return null
  return getAvatarById(props.modelValue) ?? null
})

const ageGroups = [
  { key: 'baby' as const, emoji: '👶' },
  { key: 'child' as const, emoji: '🧒' },
  { key: 'teen' as const, emoji: '🧑' },
  { key: 'adult' as const, emoji: '👨' },
  { key: 'senior' as const, emoji: '👴' },
  { key: 'all' as const, emoji: '🌟' },
]

const filteredAvatars = computed(() => {
  if (activeAgeGroup.value === 'all') return AVATARS
  return AVATARS.filter((a) => a.ageGroup === activeAgeGroup.value)
})
</script>

<template>
  <div
    class="inline-flex items-center justify-center rounded-full"
    :class="[sizeClasses, { 'ring-2 ring-primary ring-offset-2': highlight }]"
    :style="{ backgroundColor: avatar?.bgColor || '#E0E0E0' }"
    :title="avatar ? $t(avatar.nameKey) : displayName"
  >
    <span v-if="avatar" class="leading-none select-none" :class="emojiSizeClasses">
      {{ avatar.emoji }}
    </span>
    <span
      v-else
      class="select-none font-bold text-white"
      :class="textSizeClasses"
    >
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getAvatarById } from '~/app/types/avatar'

const props = withDefaults(defineProps<{
  /** ID de l'avatar (depuis la collection AVATARS) */
  avatarId?: string
  /** Nom d'affichage (pour les initiales si pas d'avatar) */
  displayName?: string
  /** Taille de l'avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Met en évidence avec un ring */
  highlight?: boolean
}>(), {
  size: 'md',
  highlight: false,
})

const avatar = computed(() => {
  if (!props.avatarId) return null
  return getAvatarById(props.avatarId) ?? null
})

const initials = computed(() => {
  if (!props.displayName) return '?'
  return props.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }
  return sizes[props.size] || sizes.md
})

const emojiSizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }
  return sizes[props.size] || sizes.md
})

const textSizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  }
  return sizes[props.size] || sizes.md
})
</script>

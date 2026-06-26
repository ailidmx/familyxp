<template>
  <div class="flex items-center gap-2" :class="sizeClass">
    <!-- Logo SVG: un "F" stylisé en forme de maison avec une étoile -->
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :class="svgSizeClass"
    >
      <!-- Toit de la maison -->
      <path
        d="M24 4L4 18h6v22h12V28h4v12h12V18h6L24 4z"
        fill="currentColor"
        class="text-primary"
      />
      <!-- Étoile dans le toit -->
      <path
        d="M24 8l2.5 5.5 6 .5-4.5 4 1.5 6L24 21l-5.5 3 1.5-6-4.5-4 6-.5L24 8z"
        fill="currentColor"
        class="text-primary-foreground"
      />
    </svg>
    <span class="font-bold tracking-tight" :class="textSizeClass">
      <slot>FamilyXP</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md'
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-sm'
    case 'md': return 'text-base'
    case 'lg': return 'text-lg'
    case 'xl': return 'text-2xl'
    default: return 'text-base'
  }
})

const svgSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-6 h-6'
    case 'md': return 'w-8 h-8'
    case 'lg': return 'w-10 h-10'
    case 'xl': return 'w-12 h-12'
    default: return 'w-8 h-8'
  }
})

const textSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-sm'
    case 'md': return 'text-lg'
    case 'lg': return 'text-xl'
    case 'xl': return 'text-3xl'
    default: return 'text-lg'
  }
})
</script>

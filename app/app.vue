<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/app/stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
})
</script>

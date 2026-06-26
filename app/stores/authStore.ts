import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthChange, getUserProfile } from '~/app/lib/firebase/auth'
import type { User } from '~/app/types'

export const useAuthStore = defineStore('auth', () => {
  const firebaseUser = ref<FirebaseUser | null>(null)
  const userProfile = ref<User | null>(null)
  const isInitialized = ref(false)
  const isLoading = ref(true)

  const isAuthenticated = computed(() => !!firebaseUser.value)
  const userId = computed(() => firebaseUser.value?.uid ?? null)
  const displayName = computed(() => userProfile.value?.displayName ?? firebaseUser.value?.displayName ?? '')
  const email = computed(() => userProfile.value?.email ?? firebaseUser.value?.email ?? '')

  function init() {
    isLoading.value = true
    onAuthChange(async (user) => {
      firebaseUser.value = user
      if (user) {
        userProfile.value = await getUserProfile(user.uid)
      } else {
        userProfile.value = null
      }
      isInitialized.value = true
      isLoading.value = false
    })
  }

  return {
    firebaseUser,
    userProfile,
    isInitialized,
    isLoading,
    isAuthenticated,
    userId,
    displayName,
    email,
    init,
  }
})

import { getAuth } from 'firebase/auth'

export default defineNuxtRouteMiddleware((to) => {
  // Pages that don't require auth
  const publicPages = ['/login', '/register', '/reset-password']
  if (publicPages.includes(to.path)) return

  const auth = getAuth()
  if (!auth.currentUser) {
    return navigateTo('/login')
  }
})

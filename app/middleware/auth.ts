export default defineNuxtRouteMiddleware((to) => {
  // Pages that don't require auth
  const publicPages = ['/login', '/register', '/reset-password']
  if (publicPages.includes(to.path)) return

  const user = useNuxtApp().$auth?.currentUser
  if (!user) {
    return navigateTo('/login')
  }
})

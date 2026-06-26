// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: 'FamilyXP',
      meta: [
        { name: 'description', content: 'Application de gamification familiale collaborative' },
        { name: 'theme-color', content: '#6366f1' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'firebase',
  },

  compatibilityDate: '2026-06-26',
})

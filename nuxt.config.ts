// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  // ─── Internationalisation (i18n) ─────────────────────────────────────────
  // Français (défaut) + Espagnol (Mexique)
  // Détection automatique via navigateur, persistance dans localStorage
  i18n: {
    locales: [
      { code: 'fr', name: 'Français', iso: 'fr-FR', file: 'fr.ts' },
      { code: 'es', name: 'Español', iso: 'es-MX', file: 'es.ts' },
    ],
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      cookieCrossOrigin: true,
    },
    vueI18n: './app/i18n/i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
      linkLocale: false,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
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

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    preset: 'firebase',
  },

  // ─── Runtime Config ──────────────────────────────────────────────────────
  // Rendre les variables d'environnement disponibles côté client
  // via useRuntimeConfig() dans les composables/composants
  runtimeConfig: {
    public: {
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'local',
      debug: process.env.NUXT_PUBLIC_DEBUG === 'true',
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      },
    },
  },

  compatibilityDate: '2026-06-26',
})

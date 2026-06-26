<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).filter(
    (l) => l.code !== locale.value
  )
})
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      @click="setLocale(loc.code)"
      class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium
             text-muted-foreground hover:text-foreground hover:bg-accent
             transition-colors duration-150"
      :title="$t('language.switchTo')"
    >
      <span class="fi" :class="`fi-${loc.code === 'fr' ? 'fr' : 'mx'}`" />
      {{ loc.name }}
    </button>
  </div>
</template>

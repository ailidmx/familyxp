<template>
  <div
    class="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-4"
  >
    <div class="flex flex-1 items-center justify-center">
      <div class="w-full max-w-sm">
        <div class="mb-8 text-center">
          <div class="text-4xl">⭐</div>
          <h1 class="mt-2 text-2xl font-bold">{{ $t("app.name") }}</h1>
          <Transition name="fade" mode="out-in">
            <p :key="currentPhrase" class="text-sm text-muted-foreground">
              {{ currentPhrase }}
            </p>
          </Transition>
        </div>
        <div class="mb-4 flex justify-center">
          <LanguageSwitcher />
        </div>
        <slot />
      </div>
    </div>
    <AppStatusFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const { t } = useI18n();

const rotatingPhraseKeys = [
  "brand.slogans.s1",
  "brand.slogans.s2",
  "brand.slogans.s3",
  "brand.slogans.s4",
  "brand.slogans.s5",
  "brand.slogans.s6",
  "brand.slogans.s7",
  "brand.slogans.s8",
  "brand.slogans.s9",
  "brand.slogans.s10",
  "brand.slogans.s11",
  "brand.slogans.s12",
  "brand.slogans.s13",
  "brand.slogans.s14",
  "brand.slogans.s15",
  "brand.slogans.s16",
  "brand.slogans.s17",
  "brand.slogans.s18",
  "brand.slogans.s19",
  "brand.slogans.s20",
  "brand.slogans.s21",
  "brand.slogans.s22",
  "brand.slogans.s23",
  "brand.slogans.s24",
];

const rotatingPhrases = computed(() => rotatingPhraseKeys.map((key) => t(key)));

const phraseIndex = ref(0);
const currentPhrase = computed(
  () => rotatingPhrases.value[phraseIndex.value] || rotatingPhrases.value[0],
);

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    phraseIndex.value = (phraseIndex.value + 1) % rotatingPhrases.value.length;
  }, 3000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

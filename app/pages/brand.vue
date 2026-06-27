<template>
  <div class="mx-auto max-w-3xl space-y-8 px-4 py-8">
    <div class="text-center space-y-3">
      <AppLogo size="xl" class="justify-center" />
      <h1 class="text-2xl font-bold">{{ $t("brand.title") }}</h1>
      <p class="text-sm text-muted-foreground">
        {{ $t("brand.subtitle") }}
      </p>
      <div
        class="inline-flex rounded-full border px-3 py-1 text-xs font-medium"
        :class="
          authStore.isTester
            ? 'border-primary text-primary'
            : 'border-border text-muted-foreground'
        "
      >
        {{ authStore.isTester ? $t("brand.modeTester") : $t("brand.modeCommunity") }}
      </div>
    </div>

    <div class="rounded-lg border bg-card p-5 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ $t("brand.carouselTitle") }}</h2>
        <span class="text-xs text-muted-foreground">{{ $t("brand.livePreview") }}</span>
      </div>

      <Transition name="brand-fade" mode="out-in">
        <div :key="`logo-${activeLogo.id}`" class="space-y-2">
          <div
            class="h-40 rounded-lg border bg-muted/20 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="activeLogo.imageUrl"
              :src="activeLogo.imageUrl"
              :alt="activeLogo.label"
              class="h-full w-full object-contain"
            />
            <AppLogo v-else size="xl" />
          </div>
          <p class="text-sm font-medium text-center">{{ activeLogo.label }}</p>
        </div>
      </Transition>

      <Transition name="brand-fade" mode="out-in">
        <p
          :key="`slogan-${activeSlogan.id}`"
          class="text-center text-sm text-muted-foreground"
        >
          {{ activeSlogan.text }}
        </p>
      </Transition>
    </div>

    <div
      v-if="authStore.isTester"
      class="rounded-lg border bg-card p-5 shadow-sm space-y-4"
    >
      <h2 class="text-sm font-semibold">{{ $t("brand.testerSpaceTitle") }}</h2>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="space-y-2">
          <label class="text-xs font-medium">{{ $t("brand.newSloganLabel") }}</label>
          <input
            v-model="newSlogan"
            type="text"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            :placeholder="$t('brand.newSloganPlaceholder')"
          />
          <button
            class="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            @click="addSloganSuggestion"
          >
            {{ $t("brand.addSloganButton") }}
          </button>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-medium">{{ $t("brand.newLogoUrlLabel") }}</label>
          <input
            v-model="newLogoUrl"
            type="url"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            :placeholder="$t('brand.newLogoUrlPlaceholder')"
          />
          <button
            class="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            @click="addLogoSuggestion"
          >
            {{ $t("brand.addLogoButton") }}
          </button>
        </div>
      </div>

      <div v-if="authStore.canManageBrandLab" class="space-y-2 border-t pt-4">
        <label class="text-xs font-medium">{{ $t("brand.addTesterLabel") }}</label>
        <div class="flex gap-2">
          <input
            v-model="testerEmail"
            type="email"
            class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            :placeholder="$t('brand.addTesterPlaceholder')"
          />
          <button
            class="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            @click="assignTesterByEmail"
          >
            {{ $t("brand.addButton") }}
          </button>
        </div>
        <p v-if="testerInfo" class="text-xs text-muted-foreground">
          {{ testerInfo }}
        </p>
      </div>
    </div>

    <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ $t("brand.logoCandidatesTitle") }}</h2>
        <span class="text-xs text-muted-foreground">{{ $t("brand.elementsCount", { count: logos.length }) }}</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <article
          v-for="logo in visibleLogos"
          :key="logo.id"
          class="rounded-lg border p-3"
          :class="
            logo.id === selectedLogoId
              ? 'border-primary bg-primary/5'
              : 'border-border'
          "
        >
          <div
            class="mb-3 h-28 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="logo.imageUrl"
              :src="logo.imageUrl"
              :alt="logo.label"
              class="h-full w-full object-contain"
            />
            <AppLogo v-else size="lg" />
          </div>
          <p class="text-sm font-medium">{{ logo.label }}</p>
          <p class="text-xs text-muted-foreground">
            {{ $t("brand.score", { count: scoreForLogo(logo.id) }) }}
          </p>
          <div class="mt-3 flex gap-2">
            <button
              class="flex-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
              @click="voteLogo(logo.id, 'like')"
            >
              👍
            </button>
            <button
              class="flex-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
              @click="voteLogo(logo.id, 'dislike')"
            >
              👎
            </button>
          </div>
        </article>
      </div>
    </div>

    <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ $t("brand.slogansTitle") }}</h2>
        <span class="text-xs text-muted-foreground">{{ $t("brand.elementsCount", { count: slogans.length }) }}</span>
      </div>

      <div class="space-y-2">
        <article
          v-for="item in visibleSlogans"
          :key="item.id"
          class="rounded-md border p-3"
          :class="
            item.id === selectedSloganId
              ? 'border-primary bg-primary/5'
              : 'border-border'
          "
        >
          <p class="text-sm font-medium">{{ item.text }}</p>
          <p class="text-xs text-muted-foreground">
            {{ $t("brand.score", { count: scoreForSlogan(item.id) }) }}
          </p>
          <div class="mt-2 flex gap-2">
            <button
              class="flex-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
              @click="voteSlogan(item.id, 'like')"
            >
              👍
            </button>
            <button
              class="flex-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
              @click="voteSlogan(item.id, 'dislike')"
            >
              👎
            </button>
          </div>
        </article>
      </div>
    </div>

    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <h2 class="text-sm font-semibold mb-3">{{ $t("brand.summaryTitle") }}</h2>
      <p class="text-sm text-muted-foreground">
        {{ $t("brand.topLogoLabel") }}:
        <span class="font-medium text-foreground">{{
          topLogo?.label || $t("brand.na")
        }}</span>
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t("brand.topSloganLabel") }}:
        <span class="font-medium text-foreground">{{
          topSlogan?.text || $t("brand.na")
        }}</span>
      </p>
      <p class="mt-2 text-xs text-muted-foreground">
        {{ $t("brand.ruleDescription") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, onMounted } from "vue";
import { useAuthStore } from "~/app/stores/authStore";
import { addUserToGroupByEmail } from "~/app/lib/firebase/users";

type VoteValue = "like" | "dislike";

type LogoCandidate = {
  id: string;
  label: string;
  imageUrl?: string;
};

type SloganCandidate = {
  id: string;
  text: string;
};

type BrandState = {
  logos: LogoCandidate[];
  slogans: SloganCandidate[];
  logoVotes: Record<string, Record<string, VoteValue>>;
  sloganVotes: Record<string, Record<string, VoteValue>>;
};

const authStore = useAuthStore();
const { t } = useI18n();
const STORAGE_KEY = "familyxp_brand_lab_v1";

const newSlogan = ref("");
const newLogoUrl = ref("");
const testerEmail = ref("");
const testerInfo = ref("");
const logos = ref<LogoCandidate[]>([]);
const slogans = ref<SloganCandidate[]>([]);
const logoVotes = ref<Record<string, Record<string, VoteValue>>>({});
const sloganVotes = ref<Record<string, Record<string, VoteValue>>>({});
const logoCarouselIndex = ref(0);
const sloganCarouselIndex = ref(0);
let carouselTimer: ReturnType<typeof setInterval> | null = null;

function svgLogo(label: string, bg: string, fg: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='560' height='320' viewBox='0 0 560 320'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${bg}'/><stop offset='100%' stop-color='#ffffff'/></linearGradient></defs><rect width='560' height='320' fill='url(#g)'/><circle cx='90' cy='92' r='48' fill='${fg}' fill-opacity='0.18'/><circle cx='465' cy='248' r='68' fill='${fg}' fill-opacity='0.16'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-size='52' font-family='Verdana, sans-serif' fill='${fg}' font-weight='700'>FamilyXP</text><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-size='24' font-family='Verdana, sans-serif' fill='${fg}' fill-opacity='0.86'>${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const defaultSlogans: SloganCandidate[] = [
  { id: "s1", text: t("brand.slogans.s1") },
  { id: "s2", text: t("brand.slogans.s2") },
  { id: "s3", text: t("brand.slogans.s3") },
  { id: "s4", text: t("brand.slogans.s4") },
  { id: "s5", text: t("brand.slogans.s5") },
  { id: "s6", text: t("brand.slogans.s6") },
  { id: "s7", text: t("brand.slogans.s7") },
  { id: "s8", text: t("brand.slogans.s8") },
  { id: "s9", text: t("brand.slogans.s9") },
  { id: "s10", text: t("brand.slogans.s10") },
  { id: "s11", text: t("brand.slogans.s11") },
  { id: "s12", text: t("brand.slogans.s12") },
  { id: "s13", text: t("brand.slogans.s13") },
  { id: "s14", text: t("brand.slogans.s14") },
  { id: "s15", text: t("brand.slogans.s15") },
  { id: "s16", text: t("brand.slogans.s16") },
  { id: "s17", text: t("brand.slogans.s17") },
  { id: "s18", text: t("brand.slogans.s18") },
  { id: "s19", text: t("brand.slogans.s19") },
  { id: "s20", text: t("brand.slogans.s20") },
  { id: "s21", text: t("brand.slogans.s21") },
  { id: "s22", text: t("brand.slogans.s22") },
  { id: "s23", text: t("brand.slogans.s23") },
  { id: "s24", text: t("brand.slogans.s24") },
];

const defaultLogos: LogoCandidate[] = [
  {
    id: "l1",
    label: t("brand.defaultLogos.l1"),
    imageUrl: svgLogo(t("brand.logoVariantCore"), "#e5e7eb", "#111827"),
  },
  {
    id: "l2",
    label: t("brand.defaultLogos.l2"),
    imageUrl: svgLogo(t("brand.logoVariantHorizon"), "#dbeafe", "#1d4ed8"),
  },
  {
    id: "l3",
    label: t("brand.defaultLogos.l3"),
    imageUrl: svgLogo(t("brand.logoVariantSpark"), "#dcfce7", "#166534"),
  },
  {
    id: "l4",
    label: t("brand.defaultLogos.l4"),
    imageUrl: svgLogo(t("brand.logoVariantPulse"), "#fee2e2", "#991b1b"),
  },
];

const voterKey = computed(() => authStore.userId || "anon-community");

function loadState() {
  if (!import.meta.client) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      logos.value = defaultLogos;
      slogans.value = defaultSlogans;
      logoVotes.value = {};
      sloganVotes.value = {};
      saveState();
      return;
    }

    const parsed = JSON.parse(raw) as BrandState;
    const parsedLogos = parsed.logos?.length ? parsed.logos : [];
    const missingDefaults = defaultLogos.filter(
      (candidate) =>
        !parsedLogos.some((existing) => existing.id === candidate.id),
    );
    logos.value = [...parsedLogos, ...missingDefaults].length
      ? [...parsedLogos, ...missingDefaults]
      : defaultLogos;
    slogans.value = parsed.slogans?.length ? parsed.slogans : defaultSlogans;
    logoVotes.value = parsed.logoVotes || {};
    sloganVotes.value = parsed.sloganVotes || {};
  } catch {
    logos.value = defaultLogos;
    slogans.value = defaultSlogans;
    logoVotes.value = {};
    sloganVotes.value = {};
  }
}

function saveState() {
  if (!import.meta.client) return;
  const payload: BrandState = {
    logos: logos.value,
    slogans: slogans.value,
    logoVotes: logoVotes.value,
    sloganVotes: sloganVotes.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function scoreFromVotes(votes: Record<string, VoteValue> = {}): number {
  return Object.values(votes).reduce(
    (acc, vote) => acc + (vote === "like" ? 1 : -1),
    0,
  );
}

function scoreForLogo(id: string): number {
  return scoreFromVotes(logoVotes.value[id]);
}

function scoreForSlogan(id: string): number {
  return scoreFromVotes(sloganVotes.value[id]);
}

function voteLogo(id: string, vote: VoteValue) {
  const current = logoVotes.value[id] || {};
  current[voterKey.value] = vote;
  logoVotes.value = { ...logoVotes.value, [id]: current };
  saveState();
}

function voteSlogan(id: string, vote: VoteValue) {
  const current = sloganVotes.value[id] || {};
  current[voterKey.value] = vote;
  sloganVotes.value = { ...sloganVotes.value, [id]: current };
  saveState();
}

function addSloganSuggestion() {
  if (!authStore.isTester || !newSlogan.value.trim()) return;
  slogans.value = [
    ...slogans.value,
    { id: `s-${Date.now()}`, text: newSlogan.value.trim() },
  ];
  newSlogan.value = "";
  saveState();
}

function addLogoSuggestion() {
  if (!authStore.isTester || !newLogoUrl.value.trim()) return;
  logos.value = [
    ...logos.value,
    {
      id: `l-${Date.now()}`,
      label: t("brand.suggestionLabel", { count: logos.value.length + 1 }),
      imageUrl: newLogoUrl.value.trim(),
    },
  ];
  newLogoUrl.value = "";
  saveState();
}

async function assignTesterByEmail() {
  testerInfo.value = "";
  if (!authStore.canManageBrandLab || !testerEmail.value.trim()) return;

  try {
    const ok = await addUserToGroupByEmail(testerEmail.value.trim(), "testers");
    testerInfo.value = ok
      ? t("brand.testerAddSuccess")
      : t("brand.testerAddNotFound");
    if (ok) testerEmail.value = "";
  } catch {
    testerInfo.value = t("brand.testerAddError");
  }
}

const topLogo = computed(() => {
  return [...logos.value].sort(
    (a, b) => scoreForLogo(b.id) - scoreForLogo(a.id),
  )[0];
});

const topSlogan = computed(() => {
  return [...slogans.value].sort(
    (a, b) => scoreForSlogan(b.id) - scoreForSlogan(a.id),
  )[0];
});

const selectedLogoId = computed(() => topLogo.value?.id || logos.value[0]?.id);
const selectedSloganId = computed(
  () => topSlogan.value?.id || slogans.value[0]?.id,
);

const visibleLogos = computed(() => {
  if (authStore.isTester) return logos.value;
  return logos.value.filter((l) => l.id === selectedLogoId.value);
});

const visibleSlogans = computed(() => {
  if (authStore.isTester) return slogans.value;
  return slogans.value.filter((s) => s.id === selectedSloganId.value);
});

const activeLogo = computed(() => {
  if (!logos.value.length) return defaultLogos[0];
  return (
    logos.value[logoCarouselIndex.value % logos.value.length] || logos.value[0]
  );
});

const activeSlogan = computed(() => {
  if (!slogans.value.length) return defaultSlogans[0];
  return (
    slogans.value[sloganCarouselIndex.value % slogans.value.length] ||
    slogans.value[0]
  );
});

function startCarousel() {
  if (carouselTimer || !import.meta.client) return;
  carouselTimer = setInterval(() => {
    if (logos.value.length > 1) {
      logoCarouselIndex.value =
        (logoCarouselIndex.value + 1) % logos.value.length;
    }
    if (slogans.value.length > 1) {
      sloganCarouselIndex.value =
        (sloganCarouselIndex.value + 1) % slogans.value.length;
    }
  }, 2800);
}

onMounted(() => {
  loadState();
  startCarousel();
});

onBeforeUnmount(() => {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
});
</script>

<style scoped>
.brand-fade-enter-active,
.brand-fade-leave-active {
  transition: opacity 260ms ease;
}

.brand-fade-enter-from,
.brand-fade-leave-to {
  opacity: 0;
}
</style>

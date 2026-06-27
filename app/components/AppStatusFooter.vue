<template>
  <footer
    class="mt-6 border-t border-border/70 bg-muted/35 px-3 py-3 text-[11px] text-muted-foreground"
  >
    <div class="mx-auto flex max-w-lg flex-wrap items-center gap-2">
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ appName }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.envLabel") }}: {{ appEnvLabel }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.projectLabel") }}: {{ firebaseProjectId }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.ticketLabel") }}: {{ ticketLabel }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.branchLabel") }}: {{ branchLabel }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.shaLabel") }}: {{ shaLabel }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.versionLabel") }}: {{ versionLabel }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.routeLabel") }}: {{ route.path }}
      </span>
      <span class="rounded-full border border-border bg-background px-2 py-1">
        {{ $t("footer.localeLabel") }}: {{ locale }}
      </span>
    </div>
    <p class="mx-auto mt-2 max-w-lg text-[10px] opacity-80">
      {{ $t("footer.geekLine") }}
    </p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";

const config = useRuntimeConfig();
const route = useRoute();
const { locale, t } = useI18n();

const appName = computed(() => t("app.name"));
const appEnvLabel = computed(() =>
  (config.public.appEnv || "local").toUpperCase(),
);
const firebaseProjectId = computed(
  () => config.public.firebase.projectId || t("footer.fallbackNa"),
);
const ticketLabel = computed(
  () => config.public.build.ticket || t("footer.fallbackTicket"),
);
const branchLabel = computed(
  () => config.public.build.branch || t("footer.fallbackBranch"),
);
const shaLabel = computed(() => {
  const raw = config.public.build.sha || "";
  return raw ? raw.slice(0, 7) : t("footer.fallbackNa");
});
const versionLabel = computed(
  () => config.public.build.version || t("footer.fallbackVersion"),
);
</script>

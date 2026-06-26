<template>
  <div class="mx-auto max-w-2xl space-y-8 py-8 px-4">
    <!-- Header -->
    <div class="text-center space-y-4">
      <AppLogo size="xl" class="justify-center" />
      <h1 class="text-2xl font-bold">Brand & Identity</h1>
      <p class="text-muted-foreground">
        Aide-nous à choisir l'identité de FamilyXP ! Vote pour tes slogans préférés.
      </p>
    </div>

    <!-- Logo preview -->
    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <h2 class="text-sm font-semibold mb-4">Logo provisoire</h2>
      <div class="flex items-center justify-center gap-4 flex-wrap">
        <AppLogo size="sm" />
        <AppLogo size="md" />
        <AppLogo size="lg" />
        <AppLogo size="xl" />
      </div>
      <p class="text-xs text-muted-foreground text-center mt-4">
        Logo SVG : un "F" stylisé en forme de maison avec une étoile
      </p>
    </div>

    <!-- Slogans voting -->
    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold">Slogans</h2>
        <span class="text-xs text-muted-foreground">{{ totalVotes }} votes</span>
      </div>

      <div class="space-y-2">
        <button
          v-for="(slogan, index) in slogans"
          :key="index"
          @click="toggleVote(index)"
          class="w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent"
          :class="{
            'border-primary bg-primary/5': hasVoted(index),
            'border-border': !hasVoted(index)
          }"
        >
          <!-- Vote count -->
          <div class="flex flex-col items-center min-w-[2.5rem]">
            <span class="text-lg font-bold" :class="hasVoted(index) ? 'text-primary' : 'text-muted-foreground'">
              {{ getVotes(index) }}
            </span>
            <span class="text-[10px] text-muted-foreground">votes</span>
          </div>

          <!-- Heart icon -->
          <div class="text-lg">
            {{ hasVoted(index) ? '❤️' : '🤍' }}
          </div>

          <!-- Slogan text -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{{ index + 1 }}. {{ slogan.text }}</p>
            <p class="text-xs text-muted-foreground">{{ slogan.lang }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Share section -->
    <div class="rounded-lg border bg-card p-6 shadow-sm text-center">
      <h2 class="text-sm font-semibold mb-2">Partage le vote !</h2>
      <p class="text-xs text-muted-foreground mb-4">
        Envoie cette page à ta famille et tes amis pour qu'ils votent aussi
      </p>
      <button
        @click="shareUrl"
        class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        📤 Partager
      </button>
    </div>

    <!-- Stats -->
    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <h2 class="text-sm font-semibold mb-4">Classement</h2>
      <div class="space-y-2">
        <div
          v-for="(item, index) in topSlogans"
          :key="item.index"
          class="flex items-center gap-3"
        >
          <span class="text-lg font-bold text-muted-foreground min-w-[1.5rem]">
            {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}` }}
          </span>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium truncate">{{ item.text }}</p>
              <span class="text-sm font-bold text-primary ml-2">{{ item.votes }}</span>
            </div>
            <div class="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                class="h-full rounded-full bg-primary transition-all duration-500"
                :style="{ width: `${(item.votes / maxVotes) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Slogan {
  text: string
  lang: string
}

const slogans: Slogan[] = [
  { text: 'Grandir ensemble, s\'amuser, réussir', lang: 'FR' },
  { text: 'Le jeu de la vie de famille', lang: 'FR' },
  { text: 'Des moments, des défis, des souvenirs', lang: 'FR' },
  { text: 'Des défis pour toute la famille', lang: 'FR' },
  { text: 'Vivre. Jouer. Progresser.', lang: 'FR' },
  { text: 'Des règles, du fun, du respect', lang: 'FR' },
  { text: 'Ensemble, on va plus loin', lang: 'FR' },
  { text: 'Au cœur de votre famille', lang: 'FR' },
  { text: 'Échanger. Comprendre. Grandir.', lang: 'FR' },
  { text: 'Un foyer. Une équipe.', lang: 'FR' },
  { text: 'Connecter. Partager. Avancer.', lang: 'FR' },
  { text: 'Objectifs. Efforts. Fierté.', lang: 'FR' },
  { text: 'Chaque jour, une aventure', lang: 'FR' },
  { text: 'Petits gestes, grandes victoires', lang: 'FR' },
  { text: 'Plus forts ensemble', lang: 'FR' },
  { text: 'Explorer. Apprendre. Grandir.', lang: 'FR' },
  { text: 'Chaque pièce compte', lang: 'FR' },
  { text: 'Efforts d\'aujourd\'hui, réussites de demain', lang: 'FR' },
  { text: 'Des habitudes qui gagnent', lang: 'FR' },
  { text: 'S\'organiser. Réussir. Profiter.', lang: 'FR' },
  { text: 'Soutenir. Encourager. Aimer.', lang: 'FR' },
  { text: 'Rêver. Planifier. Réaliser.', lang: 'FR' },
  { text: 'Ici, on se comprend', lang: 'FR' },
  { text: 'Ensemble, chaque jour', lang: 'FR' },
]

// ─── Vote system (localStorage) ────────────────────────────────────────────

const STORAGE_KEY = 'familyxp_brand_votes'

function getVotesData(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function saveVotesData(data: Record<number, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getVotes(index: number): number {
  const data = getVotesData()
  return data[index] || 0
}

function hasVoted(index: number): boolean {
  const voted = localStorage.getItem('familyxp_brand_voted')
  if (!voted) return false
  try {
    const list = JSON.parse(voted)
    return list.includes(index)
  } catch {
    return false
  }
}

function toggleVote(index: number) {
  const voted = localStorage.getItem('familyxp_brand_voted')
  let list: number[] = []
  if (voted) {
    try { list = JSON.parse(voted) } catch {}
  }

  const data = getVotesData()

  if (list.includes(index)) {
    // Unvote
    list = list.filter((i: number) => i !== index)
    data[index] = Math.max(0, (data[index] || 1) - 1)
  } else {
    // Vote
    list.push(index)
    data[index] = (data[index] || 0) + 1
  }

  localStorage.setItem('familyxp_brand_voted', JSON.stringify(list))
  saveVotesData(data)
  window.dispatchEvent(new Event('storage'))
}

const totalVotes = computed(() => {
  const data = getVotesData()
  return Object.values(data).reduce((a: number, b: number) => a + b, 0)
})

const topSlogans = computed(() => {
  const data = getVotesData()
  const entries = Object.entries(data).map(([key, votes]) => ({
    index: Number(key),
    text: slogans[Number(key)]?.text || '',
    votes: votes as number,
  }))
  return entries.sort((a, b) => b.votes - a.votes)
})

const maxVotes = computed(() => {
  if (topSlogans.value.length === 0) return 1
  return Math.max(...topSlogans.value.map(s => s.votes), 1)
})

function shareUrl() {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({
      title: 'FamilyXP - Vote pour le slogan !',
      text: 'Aide-nous à choisir le slogan de FamilyXP !',
      url,
    })
  } else {
    navigator.clipboard.writeText(url)
    alert('Lien copié dans le presse-papier !')
  }
}
</script>

/**
 * Avatar prédéfini ludique pour FamilyXP
 *
 * Chaque avatar a :
 * - Un emoji/icône visuel
 * - Un nom (pour l'affichage)
 * - Des catégories d'âge recommandées
 * - Un genre indicatif (optionnel)
 * - Des couleurs de fond
 */
export interface Avatar {
  /** Identifiant unique de l'avatar */
  id: string

  /** Emoji représentant l'avatar */
  emoji: string

  /** Nom affiché (traduisible) */
  nameKey: string

  /** Catégorie d'âge recommandée */
  ageGroup: 'baby' | 'child' | 'teen' | 'adult' | 'senior' | 'all'

  /** Genre indicatif (optionnel — pour le fun, pas de stéréotypes stricts) */
  gender?: 'boy' | 'girl' | 'neutral'

  /** Couleur de fond (hex) */
  bgColor: string

  /** Couleur de l'emoji (si applicable) */
  emojiColor?: string

  /** Thème / style de l'avatar */
  theme: 'animal' | 'fantasy' | 'food' | 'nature' | 'space' | 'sport' | 'superhero' | 'music' | 'art' | 'science'
}

/**
 * Collection complète des avatars disponibles
 */
export const AVATARS: Avatar[] = [
  // ─── Bébés / Tout-petits ───
  { id: 'baby-panda', emoji: '🐼', nameKey: 'avatar.babyPanda', ageGroup: 'baby', gender: 'neutral', bgColor: '#E8F5E9', theme: 'animal' },
  { id: 'baby-bear', emoji: '🐻', nameKey: 'avatar.babyBear', ageGroup: 'baby', gender: 'neutral', bgColor: '#FFF3E0', theme: 'animal' },
  { id: 'baby-cat', emoji: '🐱', nameKey: 'avatar.babyCat', ageGroup: 'baby', gender: 'neutral', bgColor: '#F3E5F5', theme: 'animal' },
  { id: 'baby-bunny', emoji: '🐰', nameKey: 'avatar.babyBunny', ageGroup: 'baby', gender: 'neutral', bgColor: '#FCE4EC', theme: 'animal' },

  // ─── Enfants (6-12 ans) ───
  { id: 'child-dino', emoji: '🦖', nameKey: 'avatar.childDino', ageGroup: 'child', gender: 'boy', bgColor: '#E8F5E9', theme: 'animal' },
  { id: 'child-unicorn', emoji: '🦄', nameKey: 'avatar.childUnicorn', ageGroup: 'child', gender: 'girl', bgColor: '#F3E5F5', theme: 'fantasy' },
  { id: 'child-dragon', emoji: '🐉', nameKey: 'avatar.childDragon', ageGroup: 'child', gender: 'neutral', bgColor: '#FFF3E0', theme: 'fantasy' },
  { id: 'child-fox', emoji: '🦊', nameKey: 'avatar.childFox', ageGroup: 'child', gender: 'neutral', bgColor: '#FFEBEE', theme: 'animal' },
  { id: 'child-penguin', emoji: '🐧', nameKey: 'avatar.childPenguin', ageGroup: 'child', gender: 'neutral', bgColor: '#E3F2FD', theme: 'animal' },
  { id: 'child-tiger', emoji: '🐯', nameKey: 'avatar.childTiger', ageGroup: 'child', gender: 'neutral', bgColor: '#FFF8E1', theme: 'animal' },
  { id: 'child-robot', emoji: '🤖', nameKey: 'avatar.childRobot', ageGroup: 'child', gender: 'neutral', bgColor: '#E0E0E0', theme: 'science' },
  { id: 'child-superhero', emoji: '🦸', nameKey: 'avatar.childSuperhero', ageGroup: 'child', gender: 'neutral', bgColor: '#E3F2FD', theme: 'superhero' },

  // ─── Ados (13-17 ans) ───
  { id: 'teen-wolf', emoji: '🐺', nameKey: 'avatar.teenWolf', ageGroup: 'teen', gender: 'neutral', bgColor: '#37474F', theme: 'animal' },
  { id: 'teen-phoenix', emoji: '🦅', nameKey: 'avatar.teenPhoenix', ageGroup: 'teen', gender: 'neutral', bgColor: '#FF6F00', theme: 'fantasy' },
  { id: 'teen-ninja', emoji: '🥷', nameKey: 'avatar.teenNinja', ageGroup: 'teen', gender: 'neutral', bgColor: '#263238', theme: 'sport' },
  { id: 'teen-gamer', emoji: '🎮', nameKey: 'avatar.teenGamer', ageGroup: 'teen', gender: 'neutral', bgColor: '#1A237E', theme: 'space' },
  { id: 'teen-skater', emoji: '🛹', nameKey: 'avatar.teenSkater', ageGroup: 'teen', gender: 'neutral', bgColor: '#FF5722', theme: 'sport' },
  { id: 'teen-artist', emoji: '🎨', nameKey: 'avatar.teenArtist', ageGroup: 'teen', gender: 'neutral', bgColor: '#E91E63', theme: 'art' },
  { id: 'teen-musician', emoji: '🎸', nameKey: 'avatar.teenMusician', ageGroup: 'teen', gender: 'neutral', bgColor: '#4A148C', theme: 'music' },
  { id: 'teen-astronaut', emoji: '🧑‍🚀', nameKey: 'avatar.teenAstronaut', ageGroup: 'teen', gender: 'neutral', bgColor: '#0D47A1', theme: 'space' },

  // ─── Adultes (18-60 ans) ───
  { id: 'adult-chef', emoji: '👨‍🍳', nameKey: 'avatar.adultChef', ageGroup: 'adult', gender: 'neutral', bgColor: '#FF8F00', theme: 'food' },
  { id: 'adult-gardener', emoji: '🌻', nameKey: 'avatar.adultGardener', ageGroup: 'adult', gender: 'neutral', bgColor: '#2E7D32', theme: 'nature' },
  { id: 'adult-reader', emoji: '📚', nameKey: 'avatar.adultReader', ageGroup: 'adult', gender: 'neutral', bgColor: '#1565C0', theme: 'art' },
  { id: 'adult-runner', emoji: '🏃', nameKey: 'avatar.adultRunner', ageGroup: 'adult', gender: 'neutral', bgColor: '#E65100', theme: 'sport' },
  { id: 'adult-painter', emoji: '🎨', nameKey: 'avatar.adultPainter', ageGroup: 'adult', gender: 'neutral', bgColor: '#AD1457', theme: 'art' },
  { id: 'adult-musician', emoji: '🎵', nameKey: 'avatar.adultMusician', ageGroup: 'adult', gender: 'neutral', bgColor: '#6A1B9A', theme: 'music' },
  { id: 'adult-scientist', emoji: '🔬', nameKey: 'avatar.adultScientist', ageGroup: 'adult', gender: 'neutral', bgColor: '#004D40', theme: 'science' },
  { id: 'adult-traveler', emoji: '✈️', nameKey: 'avatar.adultTraveler', ageGroup: 'adult', gender: 'neutral', bgColor: '#01579B', theme: 'nature' },

  // ─── Seniors (60+) ───
  { id: 'senior-wisdom', emoji: '🦉', nameKey: 'avatar.seniorWisdom', ageGroup: 'senior', gender: 'neutral', bgColor: '#4E342E', theme: 'animal' },
  { id: 'senior-garden', emoji: '🌳', nameKey: 'avatar.seniorGarden', ageGroup: 'senior', gender: 'neutral', bgColor: '#1B5E20', theme: 'nature' },
  { id: 'senior-star', emoji: '⭐', nameKey: 'avatar.seniorStar', ageGroup: 'senior', gender: 'neutral', bgColor: '#F57F17', theme: 'fantasy' },
  { id: 'senior-book', emoji: '📖', nameKey: 'avatar.seniorBook', ageGroup: 'senior', gender: 'neutral', bgColor: '#283593', theme: 'art' },
]

/**
 * Filtre les avatars par groupe d'âge
 * Si un groupe d'âge spécifique n'a pas assez d'avatars,
 * on complète avec des avatars "all"
 */
export function getAvatarsByAgeGroup(ageGroup: Avatar['ageGroup']): Avatar[] {
  const specific = AVATARS.filter((a) => a.ageGroup === ageGroup)
  const all = AVATARS.filter((a) => a.ageGroup === 'all')
  return [...specific, ...all]
}

/**
 * Récupère un avatar par son ID
 */
export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id)
}

/**
 * Suggère un groupe d'âge à partir d'un âge en années
 */
export function suggestAgeGroup(age: number): Avatar['ageGroup'] {
  if (age < 3) return 'baby'
  if (age < 13) return 'child'
  if (age < 18) return 'teen'
  if (age < 60) return 'adult'
  return 'senior'
}

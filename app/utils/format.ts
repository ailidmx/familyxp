export function formatPoints(points: number): string {
  const prefix = points >= 0 ? '+' : ''
  return `${prefix}${points} XP`
}

export function formatDate(date: Date | { seconds: number; nanoseconds: number }): string {
  const d = date instanceof Date ? date : new Date(date.seconds * 1000)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | { seconds: number; nanoseconds: number }): string {
  const d = date instanceof Date ? date : new Date(date.seconds * 1000)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelativeTime(date: Date | { seconds: number; nanoseconds: number }): string {
  const d = date instanceof Date ? date : new Date(date.seconds * 1000)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'à l\'instant'
  if (minutes < 60) return `il y a ${minutes} min`
  if (hours < 24) return `il y a ${hours}h`
  if (days < 7) return `il y a ${days}j`
  return formatDate(d)
}

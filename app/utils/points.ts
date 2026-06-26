import type { PointEvent } from '~/app/types'

export function calculateTotalPoints(events: PointEvent[]): number {
  return events.reduce((total, event) => {
    if (event.status === 'approved') {
      return total + event.points
    }
    return total
  }, 0)
}

export function getPointsByType(events: PointEvent[], type: PointEvent['type']): PointEvent[] {
  return events.filter((e) => e.type === type)
}

export function getPendingPoints(events: PointEvent[]): PointEvent[] {
  return events.filter((e) => e.status === 'pending')
}

export function getTodayPoints(events: PointEvent[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return events
    .filter((e) => {
      const eventDate = new Date(e.createdAt.seconds * 1000)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate.getTime() === today.getTime() && e.status === 'approved'
    })
    .reduce((total, e) => total + e.points, 0)
}

export function getWeeklyPoints(events: PointEvent[]): number {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  return events
    .filter((e) => {
      const eventDate = new Date(e.createdAt.seconds * 1000)
      return eventDate >= weekAgo && e.status === 'approved'
    })
    .reduce((total, e) => total + e.points, 0)
}

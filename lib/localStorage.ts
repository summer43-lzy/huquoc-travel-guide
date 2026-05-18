const FAVORITES_KEY = 'phuquoc_favorites'
const SCHEDULE_KEY = 'phuquoc_schedule'

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites()
  const isFav = favorites.includes(id)
  const updated = isFav ? favorites.filter(f => f !== id) : [...favorites, id]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return !isFav
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}

export interface ScheduleData {
  [date: string]: string[] // date -> attractionIds
}

export function getSchedule(): ScheduleData {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(SCHEDULE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function saveSchedule(schedule: ScheduleData): void {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule))
}

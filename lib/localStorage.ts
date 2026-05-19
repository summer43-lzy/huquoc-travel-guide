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

// ─── Ratings ──────────────────────────────────────────────────────────────────
const RATINGS_KEY = 'phuquoc_ratings'

export function getRatings(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(RATINGS_KEY) ?? '{}') } catch { return {} }
}

export function getRating(id: string): number | null {
  const r = getRatings()
  return r[id] ?? null
}

export function setRating(id: string, score: number): void {
  const r = getRatings()
  r[id] = score
  localStorage.setItem(RATINGS_KEY, JSON.stringify(r))
}

// ─── Memories (URL-based photo wall) ──────────────────────────────────────────
const MEMORIES_KEY = 'phuquoc_memories'

export interface Memory {
  id: string
  url: string
  caption: string
  day: number
  addedAt: string
}

export function getMemories(): Memory[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(MEMORIES_KEY) ?? '[]') } catch { return [] }
}

export function addMemory(memory: Omit<Memory, 'id' | 'addedAt'>): void {
  const list = getMemories()
  list.unshift({ ...memory, id: Date.now().toString(), addedAt: new Date().toISOString() })
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(list))
}

export function removeMemory(id: string): void {
  const list = getMemories().filter(m => m.id !== id)
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(list))
}

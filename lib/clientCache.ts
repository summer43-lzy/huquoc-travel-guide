// Lightweight localStorage cache with timestamp, for caching slow/unreliable
// cross-origin API responses (weather, exchange rates) that the service worker
// cannot cache. Pattern: show cached value instantly, refresh in background.

interface CacheEntry<T> {
  value: T
  savedAt: number
}

export function readCache<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as CacheEntry<T>
  } catch {
    return null
  }
}

export function writeCache<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify({ value, savedAt: Date.now() }))
  } catch {}
}

export function isFresh(savedAt: number, ttlMs: number): boolean {
  return Date.now() - savedAt < ttlMs
}

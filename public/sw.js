// Service Worker for 富国岛旅行指南
// Cache strategy:
//   - Core pages: precached on install (network-first with cache fallback)
//   - Next.js static chunks: cache-first (immutable hashed filenames)
//   - Images: cache-first with size limit

const CACHE_VERSION = 'phuquoc-v2'
const BASE = '/huquoc-travel-guide'

const PRECACHE_PAGES = [
  BASE + '/',
  BASE + '/itinerary',
  BASE + '/booking',
  BASE + '/practical',
  BASE + '/destination',
  BASE + '/memories',
]

// ── Install: precache core pages ──────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      // Use individual adds so one 404 doesn't abort the whole batch
      Promise.allSettled(PRECACHE_PAGES.map(url => cache.add(url)))
    )
  )
  self.skipWaiting()
})

// ── Activate: purge old caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin (Supabase, Unsplash, wttr.in, etc.)
  if (url.origin !== self.location.origin) return

  // Skip non-GET
  if (request.method !== 'GET') return

  const path = url.pathname

  // ── Next.js immutable static chunks: cache-first ──
  if (path.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_VERSION).then(c => c.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // ── Images: cache-first ──
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_VERSION).then(c => c.put(request, clone))
          }
          return response
        }).catch(() => new Response('', { status: 408 }))
      })
    )
    return
  }

  // ── HTML navigation: network-first, fall back to cache ──
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_VERSION).then(c => c.put(request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(request)
            .then(cached => cached ?? caches.match(BASE + '/'))
        )
    )
    return
  }
})

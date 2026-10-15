/**
 * Tokened service worker.
 *
 * The calculator does all its work in the browser, so once the shell and the
 * selected BPE table are cached there is nothing left to fetch — repeat visits
 * start instantly and the tool keeps working with no connection.
 *
 * The version and precache placeholders below are substituted at build time;
 * see the `serviceWorker()` plugin in vite.config.ts.
 */
const VERSION = '__VERSION__'
const PRECACHE_URLS = __PRECACHE__

const SHELL_CACHE = `tokened-shell-${VERSION}`
const RUNTIME_CACHE = `tokened-runtime-${VERSION}`

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  )
  // Deliberately no skipWaiting(): swapping hashed chunks underneath a page
  // that is still running would break its pending lazy imports. The new build
  // takes over on the next visit.
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names
          .filter((name) => name.startsWith('tokened-') && !name.endsWith(VERSION))
          .map((name) => caches.delete(name)),
      )
      await self.clients.claim()
    })(),
  )
})

/** Hashed and immutable: if it is cached it is still correct. */
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE)
    await cache.put(request, response.clone())
  }
  return response
}

/** Everything else: fresh when online, cached when not. */
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      await cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/404.html')
      if (fallback) return fallback
    }
    throw error
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(networkFirst(request))
})

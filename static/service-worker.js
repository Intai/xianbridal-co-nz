const cacheName = 'cache-<DIGEST>'

self.addEventListener('install', event => event.waitUntil(
  // after installing a new version of cache storage.
  caches.open(cacheName)
    // cache the homepage.
    .then(cache => cache.add('/'))
    // activate straight away.
    .then(() => self.skipWaiting()),
))

self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(names => Promise.all(
    names.map(name => {
      if (cacheName !== name) {
        // delete old caches.
        return caches.delete(name)
      }
    }),
  ))
    // start using this version of cache.
    .then(() => self.clients.claim()),
))

self.addEventListener('fetch', event => event.respondWith(
  caches.match(event.request)
    .then(response => {
      if (response) {
        return response
      }

      return fetch(event.request, { mode: 'cors' }).then(response => {
        if (response && (response.status === 200 || response.status === 403 || response.status === 404)) {
          const cloned = response.clone()
          caches.open(cacheName)
            .then(cache => {
              cache.put(event.request, cloned)
            })
        }
        return response
      })
    }),
))

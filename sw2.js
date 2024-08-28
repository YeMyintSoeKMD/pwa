/* /* Service Worker Example with Dynamic Assets */ */

const cacheName = 'v1'

// Install service worker
self.addEventListener('install', e => {
  console.log('SW installed')
})

// Activate service worker 
self.addEventListener('activate', e => {
    /* Delete old caches */
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('SW: Deleted old caches');
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

// Fetch event
// Fetch event
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
        .then(res => {
            // make copy clone of response
            const resClone = res.clone()
            // Open cache
            caches
            .open(cacheName)
            .then(cache => {
                // add response to the cache
                cache.put(e.request, resClone)
            })
            return res
        })
        .catch(() => caches.match(e.request).then(res => res))
    )
})

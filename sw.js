const cacheName = 'v1'

const cacheAssets = [
    '/',
    '/index.html',
    '/about.html',
    '/css/app.css',
    '/js/app.js',
]

// Install service worker
self.addEventListener('install', e => {
    /* Cache the assets */
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('SW: Caching files')
            cache.addAll(assets)
        })
        .then(() => self.skipWaiting())
    )
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
self.addEventListener('fetch', e => {
    /* Get Cache the assets */
    console.log('SW: Fetching')
    e.respondWith(
        fetch(e.request)
        .catch(() => caches.match(e.request))
    )
})


// tm
// jsm
https://youtu.be/IaJqMcOMuDM?si=Z-XXzMm15TyQw5Ka

/* STEP 1 - Register SW at main.js */
// Service worker registration
if("serviceWorker" in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('sw registered'))
        .catch(err => console.log(err))
    })
}

/* STEP 2 - Implement Push Event for Showing Notification when Notification is sent from the Server at sw.js*/
/* Pushing */
self.addEventListener('push', event => {
    const notification = event.data.json();
    event.waitUntil(
        // {"title": "Hello customer!", "body": "New product is out now.", "url": "/products/26"}
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: '/src/assets/icons/icon-144x144.png',
            data: {
                notifURL: notification.url
            }
          }),
    )
})

self.addEventListener('notificationclick', event => {
    event.waitUntil(
        clients.openWindow(event.notification.data.notifURL)
    )
})

/* STEP 3 - Allow permission and subscribe to server where your button exists */
const requestPermission = () => {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            // get service worker
            navigator.serviceWorker.ready.then(sw => {
                // subscribe 
                sw.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: "BCKU6syjcBdoV3EO3w-k8nior__YBYCTtBPDeD5oqGTwG5D6WVCOdGk2TCOaMQhcJK6-9MvNSAqlb_97CWXshmU"
                }).then(subscription => {
                    // subscription successful
                    axios.post('/push-subscribe', subscription)
                        .then(res => {
                            console.log(res)
                            alert('You will get some notification from us :)')
                        })
                })
            })
        }
    });
}


/* eslint-disable no-undef, no-restricted-globals */

// Source: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

// The precaching code provided by Workbox
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// worbox.routing.registerRoute(
//     new RegExp(
//         "^https://firebasestorage.googleapis.com/v0/b/open-access-856f5.appspot.com/o/schedules.json"
//     ),
//     new workbox.strategies.StaleWhileRevalidate({
//         cacheName: "schedules",
//         plugins: [new workbox.cacheableResponse.Plugin({ statuses: [200] })]
//     })
// );
workbox.routing.registerRoute(
    /^https:\/\/firebasestorage.googleapis.com\/v0\/b\/open-access-856f5.appspot.com\/o\/schedules.json/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "schedules",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60
            })
        ]
    })
);

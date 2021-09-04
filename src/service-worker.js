/* eslint-disable no-undef, no-restricted-globals */

// Source: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

// The precaching code provided by Workbox
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Source: https://dev.to/voodu/vue-3-pwa-service-worker-12di
const cacheExpirationTime = new Date(new Date().getTime() + 86400000);
const cacheRemainingTime = Math.floor(
    (cacheExpirationTime.getTime() - new Date().getTime()) / 1000
);

workbox.routing.registerRoute(
    /\.(?:png|ico|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: cacheRemainingTime,
            }),
        ],
    })
);

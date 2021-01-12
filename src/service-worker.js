/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
self.addEventListener("fetch", function(event) {});

self.__precacheManifest = [].concat(__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Source: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

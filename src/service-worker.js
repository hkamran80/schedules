/* eslint-disable no-undef, no-restricted-globals */

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    return self.clients.claim();
});

// Source: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

// The precaching code provided by Workbox
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

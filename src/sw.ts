import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import {
    precacheAndRoute,
    cleanupOutdatedCaches,
    createHandlerBoundToURL,
} from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// `self.__WB_MANIFEST` is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old cache
cleanupOutdatedCaches();

// Offline access
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));
registerRoute(
    "https://cfg-schedules.unisontech.org/schedules/latest",
    new NetworkFirst({ networkTimeoutSeconds: 60 }),
);
registerRoute(
    "https://cfg-schedules.unisontech.org/help/topics",
    new NetworkFirst({ networkTimeoutSeconds: 60 }),
);

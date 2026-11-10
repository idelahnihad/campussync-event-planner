import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";

self.skipWaiting();
clientsClaim();

const staticAssets = self.__WB_MANIFEST.filter((entry) => {
  const url = typeof entry === "string" ? entry : entry.url;
  return !url.endsWith("index.html");
});
precacheAndRoute(staticAssets);
cleanupOutdatedCaches();

registerRoute(({ request }) => request.mode === "navigate", new NetworkOnly());

const CACHE_NAME = "rosarium-v4";

const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/prayer/joyful",
  "/prayer/sorrowful",
  "/prayer/glorious",
  "/prayer/luminous",
  "/oracao/gozosos",
  "/oracao/dolorosos",
  "/oracao/gloriosos",
  "/oracao/luminosos",
  "/oratio/gaudiosa",
  "/oratio/dolorosa",
  "/oratio/gloriosa",
  "/oratio/luminosa",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Cache-first: Next.js static assets are content-hashed, safe to cache indefinitely
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.status === 200) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Cache-first: stable media and image assets
  if (
    url.pathname.startsWith("/audios/") ||
    url.pathname.startsWith("/timestamps/") ||
    url.pathname.startsWith("/artwork/") ||
    url.pathname.startsWith("/background-sound/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.status === 200) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Network-first for page navigation; cache on success so pages work offline
  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response.status === 200) cache.put(request, response.clone());
          return response;
        } catch {
          const cached =
            (await cache.match(request)) ?? (await cache.match("/"));
          return (
            cached ??
            new Response("<h1>Offline</h1>", {
              headers: { "Content-Type": "text/html" },
            })
          );
        }
      })
    );
  }
});

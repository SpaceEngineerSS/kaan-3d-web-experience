/* ═══════════════════════════════════════════
   KAAN PWA — Service Worker
   Cache-first strategy for static assets,
   network-first for pages/API
   ═══════════════════════════════════════════ */

const CACHE_NAME = "kaan-pwa-v1";

const PRECACHE_ASSETS = [
    "/",
    "/favicon.ico",
    "/pwa.png",
    "/og-image.png",
    "/manifest.json",
];

/* Install — precache critical assets */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

/* Activate — clean old caches */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

/* Fetch — cache-first for static assets, network-first for pages */
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    /* Skip non-GET and cross-origin requests */
    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    /* Static assets (images, fonts, models, videos) — cache-first */
    if (
        url.pathname.match(
            /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|glb|gltf|stl|mp4)$/
        )
    ) {
        event.respondWith(
            caches.match(request).then(
                (cached) =>
                    cached ||
                    fetch(request).then((response) => {
                        /* Only cache successful responses, skip large video */
                        if (
                            response.ok &&
                            !url.pathname.includes("kaan.mp4")
                        ) {
                            const clone = response.clone();
                            caches
                                .open(CACHE_NAME)
                                .then((cache) => cache.put(request, clone));
                        }
                        return response;
                    })
            )
        );
        return;
    }

    /* JS/CSS bundles — cache-first (hashed filenames = immutable) */
    if (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.match(/\.(js|css)$/)
    ) {
        event.respondWith(
            caches.match(request).then(
                (cached) =>
                    cached ||
                    fetch(request).then((response) => {
                        if (response.ok) {
                            const clone = response.clone();
                            caches
                                .open(CACHE_NAME)
                                .then((cache) => cache.put(request, clone));
                        }
                        return response;
                    })
            )
        );
        return;
    }

    /* Pages / API — network-first with cache fallback */
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});

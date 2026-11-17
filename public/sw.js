/*
 * KAAN service worker.
 * The cache name carries the build id (passed as ?v= at registration), so every
 * deploy starts a fresh cache and the old one is deleted on activate.
 *
 *  - HTML / RSC payloads: network first, cached copy only when offline
 *  - /_next/static (hashed, immutable): cache first
 *  - images, models: stale-while-revalidate, capped
 *  - video and range requests: never touched
 */

const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const STATIC_CACHE = `kaan-static-${VERSION}`;
const ASSET_CACHE = `kaan-assets-${VERSION}`;
const PAGE_CACHE = `kaan-pages-${VERSION}`;
const ASSET_LIMIT = 60;

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(PAGE_CACHE).then((c) => c.addAll(["/"]).catch(() => undefined)));
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    const keep = new Set([STATIC_CACHE, ASSET_CACHE, PAGE_CACHE]);
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

async function trim(cacheName, limit) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - limit; i++) await cache.delete(keys[i]);
}

function cacheable(response) {
    return response && response.status === 200 && response.type === "basic";
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;
    if (request.headers.has("range")) return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return;
    if (url.pathname.startsWith("/_vercel/")) return;

    // Hashed build output
    if (url.pathname.startsWith("/_next/static/")) {
        event.respondWith(
            caches.match(request).then(
                (hit) =>
                    hit ||
                    fetch(request).then((res) => {
                        if (cacheable(res)) {
                            const copy = res.clone();
                            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
                        }
                        return res;
                    })
            )
        );
        return;
    }

    // Images and 3D models
    if (/\.(png|jpe?g|webp|avif|gif|svg|ico|glb|gltf|woff2?)$/i.test(url.pathname) || url.pathname.startsWith("/_next/image")) {
        event.respondWith(
            caches.open(ASSET_CACHE).then(async (cache) => {
                const hit = await cache.match(request);
                const network = fetch(request)
                    .then((res) => {
                        if (cacheable(res)) {
                            cache.put(request, res.clone()).then(() => trim(ASSET_CACHE, ASSET_LIMIT));
                        }
                        return res;
                    })
                    .catch(() => hit);
                return hit || network;
            })
        );
        return;
    }

    // Navigations: network first, offline fallback to the last good copy
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((res) => {
                    if (cacheable(res)) {
                        const copy = res.clone();
                        caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
                    }
                    return res;
                })
                .catch(() => caches.match(request).then((hit) => hit || caches.match("/")))
        );
    }
    // Everything else (RSC payloads, API) goes straight to the network.
});

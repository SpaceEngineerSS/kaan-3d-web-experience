# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [SemVer](https://semver.org/).

## [2.0.0] — 2026-11

A rebuild. The dark mood and the 3D aircraft stay; nearly everything else was redone.

### Changed
- **New visual design.** Neon cyan, glow, glassmorphism, gradient text, the background grid and the HUD decorations (fake coordinates, blinking status, glitch text) are gone. The ground is now graphite tinted toward the aircraft's own grey, with one signal-orange accent. Type is Archivo (condensed display), IBM Plex Sans and IBM Plex Mono, replacing Rajdhani everywhere.
- **Fewer, stronger chapters.** The home page went from about 23 sections to 11. Specifications, size and envelope are now one chapter. The cockpit displays, TULGAR and avionics architecture are another. Weapons and mission profiles are a third.
- **Rewritten text in Turkish and English.** It is plain and factual, with correct Turkish characters. Every figure is either sourced or labelled as a target, report, plan or estimate. The programme status is current as of November 2026: P1 taxi trials done, first flight expected.
- **/mum-t redesigned** on the same system: 9 chapters instead of 17. Süper Şimşek and ANKA-3 figures were re-checked against manufacturer and Ministry statements.
- **Language persists.** It is stored in a cookie, rendered on the server and kept across pages. `<html lang>` now matches the content.
- **The disclaimer** is a one-time bar instead of a blocking modal.

### Added
- `/kaynaklar`: a credits and sources page listing the owner of every image, video and 3D model, or saying honestly when it is unknown.
- Lightbox with credits, keyboard support and focus handling.
- Device tiers (0–3). Low-end phones get lighter materials and fewer lights; devices without WebGL get a still image.
- Security headers: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`.
- `robots.txt`, `sitemap.xml`, canonical URLs, JSON-LD, per-page Open Graph data.
- Documentation in `/docs`.

### Fixed
- Hydration mismatches from the time-of-day theme and the disclaimer modal.
- The home 3D scene rendered at 60 fps for as long as the page was open. It now renders on demand and stops once you scroll past it.
- Cockpit canvases ran four loops forever and reallocated their buffers every frame.
- The MUM-T data link created a new tube geometry every few frames. It now updates one buffer in place.
- Cloned materials, the wireframe material and audio contexts were never disposed.
- The service worker served stale models and images forever and failed on video range requests.
- No reduced-motion support; tiny 6–10 px text; modals without dialog semantics or focus handling.
- A duplicate gallery image; a wrong developer attribution for the Gökdoğan and Bozdoğan missiles.

### Performance
- KAAN.glb 494 → 111 KB, anka3.glb 947 → 153 KB (Meshopt + WebP).
- kaan.mp4 31.6 → 7.5 MB, with faststart, a WebM alternative and a poster. Videos load only on play.
- Gallery 15.9 → 1.2 MB, served as AVIF or WebP through `next/image`.
- The studio lighting is built locally. The external HDR download is gone.

### Removed
- Konami code, glitch text, boot loader, sound engine, G-force simulator, keyboard-shortcut overlay, custom cursor, TXT spec download, day/night-vision theme.
- Unused files: starter SVGs, STL models, duplicate cockpit images, unused components and dependencies (`three-stdlib`, `@react-three/postprocessing`).
- Unsourced claims: RCS value, missile ranges, contract value, "world's first" statements.

## [1.0.0] — 2026-02

First public version.

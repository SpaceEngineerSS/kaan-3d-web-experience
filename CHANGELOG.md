# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [SemVer](https://semver.org/).

## [3.0.0] — 2026-11-17

A new direction. The site keeps v1's immersive feel, but everything on the page now comes from KAAN's own world: real flight footage, published figures, and cockpit visuals drawn to documented conventions.

### Added
- **Real footage opening.** Silent loops cut from Turkish Aerospace's 2024 P0 flight-test footage: chase, take-off, landing with the brake chute, wide.
- **First-flight card.** 21 February 2024, 08:50, Mürted: pilot, duration, 8,000 ft, 230 kt, gear down, brake chute, F-16D chase.
- **Through the TULGAR visor.** A scroll-scrubbed WebGL climb-out drawn in code: Anatolian terrain, runway 03, morning sky, clouds, afterburner. The colour helmet symbology (pitch ladder, flight path marker, heading tape, speed and altitude) is computed from the live state of the aircraft in the scene.
- **Airframe inspection.** An orbitable 3D model with view presets, a wireframe mode, eight numbered features and the analysts' list of P0 → P1 changes.
- **Large Area Display.** A 2.5:1 display (reported STG LAD-208) with two portals and a window strip. Pages: TSD, RDR, SMS, ENG, FUEL and FCS, using MIL-STD-2525 track shapes and cockpit colour meanings. It also has the ASELSAN standby display and a scaled 40°×32° TULGAR frame. Everything is clearly marked as representative.
- **Sensors chapter.** MURAD 600-A, KARAT 100, TOYGUN 100, LIAS 300, IRIS 300, YILDIRIM 300 and ICNI, as ASELSAN showed them in 2025.
- **Programme chapter.** P0/P1/P2, a timeline through November 2026, the SAHA 2026 order for 20 Block 10 aircraft, the Indonesia contract, the F110 export clearance and the industrial team.
- **Fonts.** B612, the open cockpit font Airbus commissioned, self-hosted with the Turkish letters it was missing.

### Changed
- **Official TUSAŞ figures:** 20.3 m long, 13.4 m span, 5 m high, 71.6 m² wing area, MTOW 34,750 kg, 2 × 13,150 kgf, +9/−3.5 g. Earlier versions used outdated numbers.
- The flight video is credited as 2024 P0 flight-test footage, not first-flight footage.
- **Carried over from the v2 work:** cookie-based language, device tiers, render-on-demand 3D, compressed models and video, the service worker fix, security headers, the sources page, robots/sitemap.

### Removed
- v1's sci-fi HUD costume: neon, glass, glitch text, fake coordinates, boot loader, Konami code, sound engine, G-force simulator.
- Unused components, assets and dependencies.

## [2.0.0] — 2026-11 (withdrawn)

An editorial redesign. It was published briefly and then rolled back. It lives in the `v2-archive` branch.

## [1.0.0] — 2026-02

First public version.

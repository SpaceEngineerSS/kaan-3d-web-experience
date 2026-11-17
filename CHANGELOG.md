# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [SemVer](https://semver.org/).

## [4.0.0] — 2026-11-18

The home page becomes a flight-test telemetry terminal. The 3D scene is the page.

### Added
- **Blueprint render of `KAAN.glb`.** The model is drawn as a lidar point cloud (up to 120k surface samples), edge lines and a fresnel X-ray shell, all as custom shaders. A scan band sweeps nose to tail. Inside it the shell clears and the procedural internals light up: fans, S-ducts, the weapons bay with notional stores, and the AESA face with a ±60° cone.
- **Airflow and exhaust.**
  - Vortex streamlines from the LERX, wing tips and fin tips, shaped by curl noise and reacting to scroll speed.
  - Shock-diamond plumes at both nozzles.
- **Camera.** It moves along a Catmull–Rom spline: chine, belly and bay, first-person canopy, MUM-T overhead. Scroll speed adds a slight FOV stretch and roll.
- **Diegetic labels.** 1px SVG leader lines lock onto 3D anchors.
- **Terminal frame and status bar.**
  - A 16px-inset hairline frame with a mission clock, measured FPS, vertical speed and a scroll-depth ruler.
  - A status bar (`SYS.MMU.KAAN // REV 2026.4`) with section indices and a `[ TELEMETRY ]` toggle.
- **Section 01.** A FLIR white-hot filter, written as a raw WebGL shader, over the real P0 footage. It has a timecode and a track box.
- **Section 03.** A BVR / wide-area display view in 1px SVG with a pointer-parallax pitch ladder and MIL-STD-2525 tracks. Every element is marked representative.
- **Section 04.** A MUM-T network: two ANKA-3 point clouds, data-link pulses, clickable nodes with mission-profile schematics, and KIZILELMA as a labelled concept node.
- **Section 05.**
  - Comparison matrix (KAAN / F-35A / Su-57) with bars and same-scale plan frames.
  - Programme matrix.
  - Horizontal archive strip with telemetry tags.
  - Full flight video.

### Changed
- **Type:** Chakra Petch, JetBrains Mono and Inter.
- **Palette:** carbon black, anodised titanium and hairlines, with two accents: afterburner red and phosphor green.
- **Styles:** no rounded corners, glass, panels, or 3-up stat tiles.

### Removed
- The v3 chapter components, the scripted flight scene and the B612 fonts. The sourced content modules stay.

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

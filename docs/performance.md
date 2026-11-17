# Performance

The goal is for the site to feel smooth on a five-year-old Android phone as well as on a desktop. v1 missed that badly. The home page drew a full-screen WebGL scene at 60 fps the whole time you were on it, four cockpit canvases each ran their own loop even when off-screen, and the main video was 31 MB with its index at the end of the file. This page covers what changed and the rules new code should follow.

## Device tiers

`src/hooks/useDeviceProfile.ts` sorts the device into a tier once, on the client, before any `<Canvas>` mounts. GL settings such as antialiasing can't change after a context is created, so the tier has to be known first.

| Tier | Who | What they get |
| ---- | --- | ------------- |
| 0 | no WebGL, software renderer, data-saver on, ≤ 1 GB RAM | a still image instead of 3D |
| 1 | phones with ≤ 3 GB RAM, ≤ 4 cores or an old GPU | 3D at DPR 1, Lambert materials (no environment lighting), two lights, fewest stars |
| 2 | other phones, mid-range laptops | DPR up to 1.5, PBR materials |
| 3 | desktop-class | DPR up to 2, antialiasing, studio environment, extra rim light |

The tier is detected from the WebGL renderer string, `navigator.deviceMemory`, `hardwareConcurrency`, `saveData`, pointer type and viewport width. While the scene runs, drei's `PerformanceMonitor` lowers the DPR in 0.25 steps if frame rate drops, and raises it again when there is headroom.

## The home scene renders on demand

`src/components/HeroScene.tsx` uses `frameloop="demand"`. A frame is drawn only when:

- the page scrolls or the pointer moves (`InputDriver` calls `invalidate()`), or
- the aircraft is still settling towards its target pose (`KaanModel` keeps invalidating until the remaining error is under 0.0005 rad).

When nothing moves, the GPU is idle. Once the `#scene-end` marker scrolls past the top of the viewport, the canvas is hidden and stops asking for frames altogether. Scroll and pointer values live in a ref, so React does not re-render on every scroll event.

Lighting comes from a 128 px cube map built once from four drei `Lightformer`s. v1 downloaded an HDR file from a CDN on every visit.

## Canvases and loops

Any `requestAnimationFrame` loop must:

1. run only while its element is on screen (IntersectionObserver) and the tab is visible (`visibilitychange`);
2. resize its backing store from a `ResizeObserver`, never by assigning `canvas.width` every frame;
3. draw one static frame when `prefers-reduced-motion: reduce` is set.

Heavy chapters mount through `src/components/site/LazyMount.tsx` when they get within 600 px of the viewport.

## Assets

**3D models** are compressed with glTF-Transform (Meshopt geometry, WebP textures). drei's `useGLTF` decodes Meshopt on its own, without a CDN.

```bash
npx @gltf-transform/cli optimize in.glb public/models/out.glb \
  --compress meshopt --texture-compress webp --simplify false --join false --flatten false
```

| Model | Before | After |
| ----- | -----: | ----: |
| KAAN.glb | 494 KB | 111 KB |
| anka3.glb | 947 KB | 153 KB |
| super-simsek.glb | 71 KB | 22 KB |

**Video** is H.264 with `+faststart` (playback can start before the whole file arrives), plus a WebM next to it and a JPEG poster. Players use `preload="none"`, so nothing downloads until someone presses play.

```bash
ffmpeg -i in.mp4 -c:v libx264 -crf 26 -preset slow -vf "scale=-2:'min(1080,ih)'" \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k public/videos/out.mp4
```

**Images** go through `next/image`, which serves AVIF or WebP at the requested size. Source files are capped at 2560 px wide.

## Service worker

`public/sw.js` registers as `/sw.js?v=<commit>`, and each deploy gets its own cache name. On activate it deletes every cache that isn't current. Pages use network-first, hashed build files use cache-first, and images and models use stale-while-revalidate with a 60-entry cap. Video and range requests are never intercepted.

## Checking it

- Chrome DevTools → Performance, with 6× CPU throttling. Scroll to the specifications and stop. The main thread should go quiet and no frames should be produced.
- Rendering → Emulate CSS `prefers-reduced-motion: reduce`. There should be no smooth scroll, no reveals and no model easing.
- Lighthouse, mobile preset. Targets: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms.

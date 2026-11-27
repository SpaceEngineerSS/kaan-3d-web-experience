# Performance

## Device tiers

`src/hooks/useDeviceProfile.ts` sorts the device into a tier once, before any `<Canvas>` mounts. It looks at the WebGL renderer string, device memory, CPU cores, Save-Data, pointer type and viewport width.

| Tier | Who | What they get |
| ---- | --- | ------------- |
| 0 | no WebGL, software renderer, Save-Data on | a still image; three.js is never downloaded |
| 1 | weak phones | 25k points, static streamlines, matcap airframe, DPR 1 |
| 2 | other phones, mid laptops | 60k points, animated streamlines, matcap airframe, DPR up to 1.5 |
| 3 | desktop-class | 120k points, physical (clearcoat) airframe with the PMREM hangar, baked contact shadow, DPR up to 2 |

There is no post-processing pass; the vignette is a CSS gradient over the canvas.

With reduced motion on, the camera snaps between section keyframes and modes switch without the sweep. There is no FOV stretch, roll or clock.

## When things draw

- **Terminal scene:** a `frameloop` of `"always"` while `#track` is on screen and the tab is visible, `"never"` otherwise.
- **Point sampling and edge extraction:** these run once when the model loads, which takes about 100–200 ms on desktop.
- **Airframe:** the hangar PMREM is baked in an idle callback, and the airframe shader compiles with `compileAsync` (parallel shader compile), so neither lands in the first long task. The aircraft is swept in when it is ready.
- **Render loop:** no allocations inside `useFrame` (enforced by ESLint). A 60 × (four modes + inspect in/out) cycle leaves `renderer.info` unchanged at steady state (8 geometries, 4 textures, 12 programs on tier 3).
- **Frame and leader lines:** each runs one rAF that writes `textContent` and SVG attributes directly. There are no React re-renders per frame.
- **Sound:** `lib/audio/hangar.ts` is only imported after the first click on `[ SES ]`; the `AudioContext` is suspended while the tab is hidden.
- **FLIR feed:** a raw WebGL program. The video gets its `src` only when it is on screen, so the first load downloads no video. The texture, buffer and program are deleted on unmount.

## Assets

| Asset | Size |
| ----- | ---: |
| KAAN.glb (Meshopt + WebP) | 111 KB |
| anka3.glb | 153 KB |
| Footage loops (`media/clips`, H.264, silent, 854 px) | 0.6–1.8 MB each |
| Full videos (`public/videos`, H.264 only, faststart) | 15 MB in all (KAAN 6.3 MB), load only on play |
| Gallery (9 JPEGs, ≤ 2560 px) | ~1.2 MB total, served as AVIF/WebP by `next/image` |
| Fonts (Chakra Petch, Inter, JetBrains Mono via `next/font`) | ~240 KB, subset per script |

Re-encode a loop:

```bash
ffmpeg -ss 15.2 -t 12 -i public/videos/kaan.mp4 -an -vf "scale=854:-2,fps=30" \
  -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart public/media/clips/chase.mp4
```

Compress a model:

```bash
npx @gltf-transform/cli optimize in.glb public/models/out.glb \
  --compress meshopt --texture-compress webp --simplify false --join false --flatten false
```

## Service worker

`public/sw.js` registers as `/sw.js?v=<commit>`, and each deploy gets fresh caches. It handles requests like this:

- pages: network-first (nothing is precached on install)
- hashed build files: cache-first
- images and models: stale-while-revalidate, capped
- video and range requests: never touched

## Measuring

`scripts/capture.mjs` loads a production build over the Chrome DevTools Protocol with `?stats` and writes, for every section × width (1440 / 768 / 390), every mode, `/mum-t` and `/kaynaklar`: a screenshot, average FPS over 3 s, draw calls, triangles, points, geometries, textures, horizontal overflow, the number of visible reading blocks (`[data-read]`) and leader labels. Reports are in `docs/perf/*.json` (`baseline.json` is v4.0.1).

```bash
npm run build && npx next start -p 3210
node scripts/capture.mjs http://localhost:3210 --label v5
node scripts/capture.mjs http://localhost:3210 --readme      # README shots
```

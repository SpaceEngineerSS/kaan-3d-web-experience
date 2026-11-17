# Performance

## Device tiers

`src/hooks/useDeviceProfile.ts` sorts the device into a tier once, before any `<Canvas>` mounts. It looks at the WebGL renderer string, device memory, CPU cores, Save-Data, pointer type and viewport width.

| Tier | Who | What they get |
| ---- | --- | ------------- |
| 0 | no WebGL, software renderer, Save-Data on | stills and real footage only, no 3D |
| 1 | weak phones | 3D at DPR 1, Lambert materials, no clouds, coarser terrain |
| 2 | other phones, mid laptops | DPR up to 1.5, PBR, sky-lit reflections, 12 clouds |
| 3 | desktop-class | DPR up to 2, antialiasing, shadows, 22 clouds |

When reduced motion is on, the visor scene is replaced by a still image.

## When things draw

- **Visor scene:** a `frameloop` of `"always"` while its section is on screen and the tab is visible, `"never"` otherwise. It mounts one screen early so the shaders compile before you reach it.
- **Airframe:** `frameloop="demand"`, which draws only while you interact or a camera move is finishing.
- **Cockpit:** one `requestAnimationFrame` loop for all display pages. It runs only while the chapter is on screen and the tab is visible, and resizes through a `ResizeObserver`.
- **Footage clips** (`site/Film.tsx`): they play only while on screen and pause in background tabs. The first-screen clip is the only one that preloads.

## Assets

| Asset | Size |
| ----- | ---: |
| KAAN.glb (Meshopt + WebP) | 111 KB |
| anka3.glb | 153 KB |
| Footage loops (`media/clips`, H.264, silent, 854 px) | 0.6–1.8 MB each |
| Full flight video (H.264 + VP9, faststart) | 7.5 MB / 6.3 MB, loads only on play |
| Gallery (9 JPEGs, ≤ 2560 px) | ~1.2 MB total, served as AVIF/WebP by `next/image` |
| Fonts (B612 ×4 WOFF2, Rajdhani) | ~170 KB |

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

- pages: network-first
- hashed build files: cache-first
- images and models: stale-while-revalidate, capped
- video and range requests: never touched

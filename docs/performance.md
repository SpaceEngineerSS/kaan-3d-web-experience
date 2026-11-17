# Performance

## Device tiers

`src/hooks/useDeviceProfile.ts` sorts the device into a tier once, before any `<Canvas>` mounts. It looks at the WebGL renderer string, device memory, CPU cores, Save-Data, pointer type and viewport width.

| Tier | Who | What they get |
| ---- | --- | ------------- |
| 0 | no WebGL, software renderer, Save-Data on | a still image; three.js is never downloaded |
| 1 | weak phones | 25k points, static streamlines, DPR 1 |
| 2 | other phones, mid laptops | 60k points, animated streamlines, DPR up to 1.5 |
| 3 | desktop-class | 120k points, bloom/noise/vignette pass, DPR up to 2 |

With reduced motion on, the camera snaps between section keyframes. There is no FOV stretch, roll, clock or noise.

## When things draw

- **Terminal scene:** a `frameloop` of `"always"` while `#track` is on screen and the tab is visible, `"never"` otherwise.
- **Point sampling and edge extraction:** these run once when the model loads, which takes about 100–200 ms on desktop.
- **Frame, status bar and leader lines:** each runs one rAF that writes `textContent` and SVG attributes directly. There are no React re-renders per frame.
- **FLIR feed:** a raw WebGL program. The video and the loop run only while it is on screen. The texture, buffer and program are deleted on unmount.

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

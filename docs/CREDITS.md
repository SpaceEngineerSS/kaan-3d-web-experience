# Credits

The source of truth is [`src/content/media-credits.ts`](../src/content/media-credits.ts). The site's [Sources page](https://kaan-3d-web-experience.vercel.app/kaynaklar) and the gallery captions both read from it. This file summarises it for people browsing the repository.

If you own one of these images and want it credited differently or removed, please [open an issue](https://github.com/SpaceEngineerSS/kaan-3d-web-experience/issues). It will be handled quickly.

## 3D models

| File | Credit |
| ---- | ------ |
| `public/models/KAAN.glb` | Kaan Azman ([LinkedIn](https://www.linkedin.com/in/kaan-azman-591776201/)) |
| `public/models/anka3.glb` | Source unknown |
| `public/models/super-simsek.glb` | Source unknown |

All three were compressed for the web with glTF-Transform. The geometry is unchanged.

## Photographs and images

| File | Credit |
| ---- | ------ |
| `gallery/kaan-2.jpg` | Photo: Cem Doğut (signature on the image) |
| `gallery/kaan-14.jpg` | News photo from a first-flight report in German media; original owner unknown |
| `gallery/kaan-5.jpg` | Source unknown, publicly shared image |
| `gallery/2061439.jpg` | Wallpaper / stock image no. 2061439; original owner unknown |
| `gallery/kaan-6.jpg` | Via X (Twitter); author unknown |
| `gallery/kaan-1.jpg` | Computer render; source unknown |
| `gallery/kaan-13.jpg` | Stock image used by Turkish news sites; original owner unknown |
| `gallery/kaan-4.jpg` | Early TF-X render; source unknown |
| `gallery/kaan-7.jpg` | Figure from a Turkish-language publication ("Şekil 1: APAJ sistemi"); publication unknown |

## Video

| File | Credit |
| ---- | ------ |
| `videos/kaan.*` | Turkish Aerospace footage of KAAN P0 flight testing in 2024 (most likely the second flight, 6 May 2024), from a public share; rights belong to Turkish Aerospace |
| `media/clips/*.mp4` | Short silent loops cut from `videos/kaan.mp4` (same credit) |
| `videos/anka3.*` | Presidency of Defence Industries (SSB) and Turkish Aerospace (logos shown in the video) |
| `videos/super-simsek.*` | Publisher unknown |

## Original material

These were made for this project and are covered by the repository's MIT licence:

- the technical drawings and diagrams on the site (scale frames, stealth outline and return pattern, avionics block diagram, station diagram, turbofan section, timelines, MUM-T diagrams)
- the simulated Large Area Display pages, standby display and TULGAR visor symbology
- the flight scene (terrain, runway texture, cloud sprite, flight profile)
- the screenshots in `docs/images/`

## Typefaces

All three are served through `next/font/google` under the SIL Open Font License 1.1:

- **Chakra Petch** (Cadson Demak): display type
- **Inter** (Rasmus Andersson): body text
- **JetBrains Mono** (JetBrains): figures, labels and readouts

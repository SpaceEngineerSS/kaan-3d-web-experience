# Content and sources

KAAN is still in development, so most of what is known about it comes from Turkish Aerospace statements, trade-show material and press reports. This site tries to be clear about which kind of fact it is showing.

## How figures are labelled

| Label on the page | Meaning |
| ----------------- | ------- |
| *(no label)* | Published by the manufacturer or widely reported without contradiction, e.g. length, first-flight date |
| **tasarım hedefi / design target** | A stated goal that flight testing hasn't confirmed, e.g. Mach 1.8 |
| **bildirilen / reported** | Appears in press reports but hasn't been confirmed officially |
| **planlanan / planned** | An announced intention, e.g. weapons integration or the TF35000 engine |
| **tahmini / estimate** | A third-party estimate, used for competitor aircraft whose data is not public |
| **temsili / illustrative** | A drawing or simulation made for this site that shows the idea, not the real thing |

A number that couldn't be traced to a source was removed in v2. Removed figures include the radar cross-section value, the missile ranges and the Indonesia contract value.

## Where the text lives

| Topic | File |
| ----- | ---- |
| Hero, story beats, specifications | `src/content/aircraft.ts` |
| Stealth | `src/content/stealth.ts` |
| Cockpit, TULGAR, avionics | `src/content/cockpit.ts` |
| Weapons | `src/content/weapons.ts` |
| Engine | `src/content/engine.ts` |
| Comparison | `src/content/comparison.ts` |
| Industry and production | `src/content/industry.ts` |
| Timeline | `src/content/timeline.ts` |
| Media chapter text | `src/content/media.ts` |
| Image, video and model credits | `src/content/media-credits.ts` |
| Data sources (shown on /kaynaklar) | `src/content/sources.ts` |
| MUM-T page | `src/content/mumt.ts` |

`DATA_AS_OF` in `aircraft.ts` is the date the figures were last checked. It is shown in the footer. Update it whenever you re-check the programme status.

## Correcting a figure

1. Find the value in the table above and change it in both `tr` and `en`.
2. If its status changed, update or remove its `note`. For example, when the P1 prototype flies, the timeline entry moves from planned to done.
3. Put the source link in the pull request.

## Adding a sentence in both languages

```ts
// src/content/engine.ts
export const engine: Record<Locale, { … }> = {
  tr: { lede: "KAAN iki motorla uçar. …" },
  en: { lede: "KAAN flies on two engines. …" },
};
```

TypeScript fails the build if one language is missing a field.

## Images

Add the file under `public/gallery/` with a maximum width of 2560 px, as a JPEG. Then add an entry to `galleryCredits` in `media-credits.ts` with:

- `alt` in both languages
- the credit, or an honest "source unknown"
- the source URL, if there is one
- the image's width and height

The `/kaynaklar` page and the lightbox caption read from that list.

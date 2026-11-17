# Contributing

Thanks for taking the time. This is a personal project, but corrections and improvements are welcome, especially fixes to facts and figures.

Before anything else: this site is **not affiliated with Turkish Aerospace (TUSAŞ)**. Please don't add official logos, documents marked as restricted, or images you don't have a right to share. Every image needs an entry in `src/content/media-credits.ts`.

## Running it locally

You need Node 20.9 or newer.

```bash
git clone https://github.com/SpaceEngineerSS/kaan-3d-web-experience.git
cd kaan-3d-web-experience
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run typecheck
npm run lint
npm run build
```

## Where things live

- `src/content/` holds all text, in Turkish and English, as typed objects. Most text fixes happen here.
- `src/components/chapters/` contains one file per section of the home page.
- `src/components/mum-t/` is the manned–unmanned teaming page.
- `src/lib/three/` and `src/hooks/useDeviceProfile.ts` handle the 3D side.

[docs/architecture.md](docs/architecture.md) explains how it all fits together, and [docs/content-and-sources.md](docs/content-and-sources.md) covers how to add or correct a figure.

## A few rules

- **Facts need a source.** If you change a number, put the source in the PR description. Estimates and programme targets are labelled as such on the page. Please keep it that way.
- **Both languages.** A text change goes in `tr` and `en` together. Turkish uses proper characters (ç, ğ, ı, İ, ö, ş, ü).
- **Keep it light.** New 3D or canvas work has to pause when it is off-screen, and it has to respect `prefers-reduced-motion`. See [docs/performance.md](docs/performance.md).
- **Colour.** Stick to the tokens in `src/app/globals.css`. There is one accent colour, and it is used sparingly.

Commit messages follow the usual `type: summary` form (`fix:`, `feat:`, `docs:`, `perf:` …). Small, focused pull requests are easier to review than big ones.

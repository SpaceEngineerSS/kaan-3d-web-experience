# Contributing to KAAN 3D Web Experience

> **⚠️ IMPORTANT: Legal Context**
> This is a **fan-made portfolio project** and is NOT affiliated with TUSAŞ/TAI.
> All contributions must respect the intellectual property of TUSAŞ.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/SpaceEngineerSS/kaan-3d-web-experience.git
cd kaan-3d-web-experience

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Guidelines

### Code Standards
- **TypeScript** — Strict mode enabled, no `any` types
- **React 19** — Functional components with hooks only
- **Tailwind CSS v4** — Use `@theme` tokens, avoid arbitrary values
- **No `// TODO`** — Complete implementations only

### Commit Convention
Use [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add new cockpit panel layout
fix: correct canvas cursor inheritance
docs: update legal disclaimer
style: refine HUD overlay opacity
perf: optimize gallery lazy loading
```

### Branch Naming
```
feature/cockpit-stores-panel
fix/canvas-cursor-issue
docs/contributing-guide
```

## Project Architecture

```
src/
├── app/           # Next.js 16 App Router pages and layouts
├── components/    # React UI components (30+ components)
│   ├── ui/        # Sub-components (CockpitDashboard, SoundEngine, HUDOverlay, ComparisonChart)
│   └── *.tsx      # Section-level components (HeroScene, WeaponConfig, AvionicsArchitecture, etc.)
├── hooks/         # Custom React hooks (useMouseParallax, useKeyboardShortcuts, useKonamiCode)
├── context/       # React Context providers (Language, Theme)
└── lib/           # Utilities, translations, helpers
```

### Key Technologies
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16+ | App Router, SSR, Turbopack |
| React | 19+ | Hooks, Context, Dynamic Imports |
| React Three Fiber | 9+ | 3D rendering (STL model) |
| @react-three/postprocessing | 3+ | Bloom, Vignette, Chromatic Aberration |
| @react-three/drei | 10+ | Environment, Stars, Html overlays |
| GSAP | 3.14+ | Scroll animations |
| Tailwind CSS | v4 | Styling |
| Lucide React | — | Icons |

## Asset Policy

> **🚫 DO NOT** add proprietary TUSAŞ/TAI assets without proper attribution.

- All images in `public/gallery/` are sourced from publicly available media
- The 3D model is for demonstration purposes only
- No official TUSAŞ logos, classified documents, or restricted imagery

## Testing

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Lint
npm run lint
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with complete implementations
4. Ensure `tsc --noEmit` and `npm run build` pass with zero errors
5. Submit a PR with a clear description

## Code of Conduct

Be respectful, constructive, and mindful of the project's legal context. This is a community-driven fan project.

---

**Maintainer:** [Mehmet Gümüş](https://github.com/SpaceEngineerSS)

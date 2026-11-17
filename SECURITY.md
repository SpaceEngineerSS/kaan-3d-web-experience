# Security

## Supported versions

Only the current major line gets fixes.

| Version | Supported |
| ------- | --------- |
| 2.x     | yes       |
| 1.x     | no        |

## Reporting a problem

Please don't open a public issue for a vulnerability. Use GitHub's private reporting instead:
**Security → Report a vulnerability** on this repository. Describe what you found, how to reproduce it and what you think the impact is. I'll answer within a week and will credit you in the fix unless you'd rather not be named.

## What the site does and doesn't do

It's a front-end showcase. There are no accounts, no forms, no database and no API routes.

- **Response headers** are set in `next.config.ts`: a Content Security Policy (scripts, styles, images, media and fonts from the same origin only; no framing), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` and HSTS. The CSP still allows `'unsafe-inline'` for scripts and styles because Next.js injects inline bootstrap code; moving to nonces is on the list.
- **Analytics**: the deployed site uses Vercel Web Analytics, which counts page views without cookies. It is served from the same origin (`/_vercel/insights/*`).
- **Browser storage**: one cookie (`kaan-locale`) remembers the language, and `localStorage` remembers that the notice bar was dismissed. Nothing else is stored.
- **Service worker** (`public/sw.js`): caches build assets, images and 3D models for offline use. Its cache name carries the deploy's commit id, so each deploy starts clean. It never caches video or range requests.
- **Inline HTML**: the only `dangerouslySetInnerHTML` is the static JSON-LD block in `src/app/layout.tsx`, built from constants.

## Dependencies

Run `npm audit` before a release. Dependabot alerts are enabled on the repository.

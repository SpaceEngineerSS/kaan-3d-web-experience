# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **DO NOT** open a public issue
2. Email: Contact via [GitHub profile](https://github.com/SpaceEngineerSS)
3. Include a detailed description of the vulnerability
4. Allow reasonable time for a fix before public disclosure

## Security Measures

This project implements the following security practices:

### Client-Side
- **Content Security Policy** — Meta tags restrict script sources
- **No user data collection** — No authentication, no databases, no cookies
- **Session storage only** — Disclaimer acceptance stored in `sessionStorage` (cleared on tab close)
- **No external API calls** — Fully static site, no server-side endpoints
- **XSS prevention** — React's built-in escaping, no `dangerouslySetInnerHTML`

### Dependencies
- Regular `npm audit` checks recommended
- Minimal dependency footprint
- No server-side code execution

### Deployment
- Static export compatible
- No environment variables or secrets required
- No database connections

## Scope

This is a **static frontend project** with no backend, no user authentication, and no data persistence beyond `sessionStorage`. The attack surface is minimal.

---

**Maintainer:** [Mehmet Gümüş](https://github.com/SpaceEngineerSS)

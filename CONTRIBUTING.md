# Contributing

Thanks for your interest. This doc covers setup, conventions, and how to contribute effectively.

---

## Setup

```bash
git clone https://github.com/your-org/rosarium-today.git
cd rosarium-today
npm install
npm run dev
```

Requires Node 20+.

---

## Workflow

1. Fork the repo and create a branch from `main`
2. Make your change
3. Run `npm run lint` — all lint errors must pass
4. Open a PR with a clear description of what and why

For non-trivial changes, open an issue first to discuss scope before writing code.

---

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint:

```
feat: add Spanish locale
fix: correct Ave Maria word timestamps for pt-br female voice
refactor: extract seekToWord into use-rosary-player
docs: document audio asset naming convention
```

Husky runs commitlint on every commit. Non-conforming commit messages will be rejected.

---

## Code Conventions

See `CLAUDE.md` for the full list. Short version:

- **No magic numbers** — named constants in `config/`
- **Replace, don't add alongside** — delete the old pattern when migrating
- **No comments explaining what** — only comment when the *why* is non-obvious
- **No unnecessary abstractions** — three similar lines beats a premature helper
- **`"use client"` at template level** — pages stay server components

---

## Good First Issues

These areas need work and are well-scoped for new contributors:

### PWA Manifest
The app calls itself a PWA but has no `manifest.json` or service worker. Add `public/manifest.json` with name, icons, theme color, and `display: "standalone"`. Register a service worker for offline caching.

### Test Suite
No tests exist. Set up Vitest + React Testing Library. Start with:
- `useRosaryProgress`: step navigation, localStorage persistence, hydration guard
- `useRosaryPlayer`: play/pause toggle, seek, word index calculation
- `normalizeSettings` / `parseSettingsCookie` in `config/settings.ts`

### Prayer History
Home page stats (streak, last prayer) are hardcoded. Implement a localStorage tracker in `hooks/use-prayer-history.ts` that records completed mystery sessions and computes streak + last-played date.

### CI Pipeline
No GitHub Actions workflow exists. Add `.github/workflows/ci.yml` that runs `npm run lint` and `npm run build` on every PR.

### Error Boundaries
Audio load failures are silent. Add a React error boundary around `PrayerTemplate` that shows a user-facing fallback.

---

## Adding a Language

1. Add the locale key to `config/locales.ts` and `SUPPORTED_LOCALES`
2. Create `i18n/ui/{locale}.json` — copy `i18n/ui/en.json` and translate all strings
3. Create `i18n/prayers/{locale}.json` — copy `i18n/prayers/en.json` and translate mystery names and prayer texts
4. Add audio files to `public/audios/{locale}/female/` and `/male/` following the naming in `player/assets.ts`
5. Add word-timestamp JSON files to `public/timestamps/{locale}/female/` and `/male/`
6. Add a display name to `LOCALE_OPTIONS` in `config/locales.ts`

Timestamp JSON format: `[{ "word": "string", "start": number, "end": number }]`

Audio files without timestamps will still work — the prayer text renders without word highlighting.

---

## Adding an Accent Color

Accent palettes are in `config/accents.ts`:

```typescript
ACCENT_VARS = {
  gold: { dark: { gold, dim, soft }, light: { gold, dim, soft } },
  wine: { ... },
  moss: { ... },
  // add here
}
```

Also add the key to `ACCENT_COLORS` and a swatch entry in `ACCENT_OPTIONS`.

---

## Audio Files

Audio files are not included in the repository due to file size. When developing locally:
- Either generate TTS audio using your preferred tool
- Or use `?silent=1` on the prayer route to bypass audio entirely: `/prayer/joyful?silent=1`

If you're contributing new audio, follow the existing naming convention and include matching timestamp JSON.

---

## Questions

Open an issue with the `question` label, or start a GitHub Discussion.

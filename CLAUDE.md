# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
```

No test runner is configured yet. Vitest + React Testing Library is the planned choice.

## Architecture

**Rosarium Today** is a Next.js 15 App Router rosary prayer PWA using React 19, TypeScript, Tailwind CSS v4, shadcn/ui, and `next-intl` for i18n.

### Component Structure (Atomic Design)

```
components/
  atoms/       # Primitives: Button, BeadViz, ThemeSwitcher, CatholicCross icon
  molecules/   # Compositions: MysteryCard, MysteryCarousel, DonateModal
  organisms/   # Feature sections: AppSidebar, SettingsDrawer
  templates/   # Page layouts: HomeTemplate
```

Each component lives in its own folder with an `index.ts` barrel export.

### Settings System

Settings (theme, accent, UI language, prayer language, sidebar collapse state) flow through three layers:

1. **Cookie** (`rosarium-settings`) — read in `app/layout.tsx` on every request
2. **Context** (`providers/SettingsProvider.tsx`) — holds state and exposes `useSettings()` hook
3. **DOM** — provider applies CSS custom properties, `dark`/`light` classes, and `lang` attribute directly to `<html>`

Mutations call `saveSettingsCookie()` (a server action in `app/actions/settings.ts`) via `useTransition`. On `uiLanguage` change, `SettingsProvider` redirects to the localized URL for the current page via `router.push`. On `prayerLanguage` change, it calls `router.refresh()`. Config types, cookie parsing, and defaults live in `config/settings.ts`.

### i18n

`next-intl` with three locales: `en`, `pt-br`, `la`. Messages are split into two namespaces:
- `i18n/ui/` — interface strings (nav, settings labels)
- `i18n/prayers/` — rosary mystery names and decade prayers

Request config at `i18n/request.ts` dynamically imports the correct JSON files. Components call `useTranslations("namespace")` on the client.

### Localized Routes

`proxy.ts` (Next.js 16 proxy, formerly middleware) handles route-based i18n. Localized URL segments are defined in `config/routes.ts`:
- `en`: `/prayer/joyful`, `/privacy`, `/terms`
- `pt-br`: `/oracao/gozosos`, `/privacidade`, `/termos`
- `la`: `/oratio/gaudiosa`, `/privata`, `/termini`

The proxy rewrites non-English URLs to canonical en paths internally, and redirects canonical paths to localized URLs when locale ≠ `en`. Navigation links use `getLocalizedPrayerPath` / `getLocalizedPath` from `config/routes.ts`.

### Theming & Styling

Tailwind v4 uses a CSS-first approach — no `tailwind.config.ts`. Theme tokens are CSS custom properties in `app/globals.css`. Three accent palettes (gold, wine, moss) are defined in `config/accents.ts` with separate dark/light values; the `SettingsProvider` writes them as `--gold`, `--gold-dim`, `--gold-soft` CSS variables at runtime. Fonts: Cormorant Garamond (display), Source Serif 4 (body), Cinzel (caps), Inter (UI).

### Rosary Domain

`config/rosary.ts` defines the four mystery types (joyful, sorrowful, glorious, luminous), the day-of-week mapping, and per-mystery gradient values. The home page always displays today's designated mysteries.

### Server vs. Client Components

- Pages are server components by default; add `"use client"` only when needed for state or browser APIs.
- `HomeTemplate`, `AppSidebar`, `SettingsDrawer`, and `SettingsProvider` are all client components.
- `app/layout.tsx` reads the settings cookie server-side and passes initial values into `SettingsProvider`.

## Code Conventions

- **No magic numbers** — use named constants in the appropriate `config/` file.
- **Replace, don't add alongside** — when migrating a pattern, remove the old version rather than leaving both.
- **Minimal refactors** — extract one cohesive piece at a time; do not bundle hooks, sub-components, and column definitions in a single pass unless asked.
- **No comments explaining what** — only comment when the *why* is non-obvious (hidden constraint, subtle invariant, browser workaround).
- **`"use client"` at template level** — pages stay server components; push the client boundary down to the template.

## Known Gaps

See `ARCHITECTURE.md#known-gaps--roadmap` for a full list. Key items:
- No test suite (no test runner configured)
- No PWA manifest / service worker (despite PWA branding)
- Home page stats (streak, last prayer) are hardcoded placeholders
- `DonateModal` has empty URL constants (`PIX_KEY`, `KOFI_URL`, `BMC_URL`)
- `ThemeSwitcher` atom appears unused — verify before removing

## Docs Map

- `README.md` — project overview, quick start, project structure
- `ARCHITECTURE.md` — routing, settings system, audio playback, decision log
- `CONTRIBUTING.md` — workflow, commit conventions, good first issues, how to add a locale

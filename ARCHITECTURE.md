# Architecture

## Overview

Rosarium Today is a Next.js 15 App Router PWA. It has no backend — all prayer progress is stored in localStorage, all settings in a cookie. Audio files and word-timestamp JSON are static assets served from `public/`.

```
Browser
  ├── Settings cookie (persisted across sessions, read server-side for SSR)
  ├── localStorage (prayer progress per mystery)
  └── Static assets (audio .mp3, timestamp .json)
```

---

## Routing

| Route               | Component        | Server/Client                 |
| ------------------- | ---------------- | ----------------------------- |
| `/`                 | `HomeTemplate`   | Server page → client template |
| `/prayer/[mystery]` | `PrayerTemplate` | Server page → client template |

Pages are server components by default. Templates (which need state and browser APIs) are client components. The `"use client"` boundary lives at the template level, not the page level.

### Silent Mode

`/prayer/joyful?silent=1` disables audio entirely — useful for text-only prayer or testing.

---

## Settings System

Settings flow through three layers so SSR and CSR agree on initial render:

```
Request
  └─► app/layout.tsx (server)
        reads rosarium-settings cookie
        passes initialSettings to SettingsProvider
              │
              ▼
        SettingsProvider (client context)
          holds AppSettings state
          applySettingsToDocument() → writes to <html>:
            - lang attribute
            - dark/light/theme-* class
            - --gold, --gold-dim, --gold-soft CSS vars
              │
              ▼
        patchSettings(patch)
          updates local state
          calls saveSettingsCookie() (server action)
          router.refresh() on locale change
```

**Why a cookie and not localStorage?** Settings must be available on the first server render to avoid a flash of wrong theme or language. Cookies are the only persistent storage readable server-side.

**Why a server action and not an API route?** `saveSettingsCookie()` is a single fire-and-forget call. Server actions keep the settings concern co-located with the cookie logic without a separate route handler.

---

## Rosary Domain

### Step Structure

The full rosary is modeled as **79 ordered steps** in `player/rosary-steps.ts`:

```
Opening (7 steps)
  Sign of the Cross
  Apostles' Creed
  Our Father
  3× Hail Mary
  Glory Be

5× Decade (13 steps each = 65 total)
  Mystery Announcement  ← prayerKey: null (triggers reflection UI)
  Our Father
  10× Hail Mary
  Glory Be
  Fatima Prayer

Closing (1 step)
  Hail Holy Queen
```

Steps with `prayerKey: null` are reflection pauses — they show an animated countdown and auto-advance after 10 seconds (configurable).

### Progress Persistence

`useRosaryProgress(mysteryKey)` saves `currentStepIndex` to localStorage under `rosarium:progress:{mysteryKey}`. On mount it defers the read with `queueMicrotask()` to avoid hydration mismatches.

```typescript
// Key pattern
`rosarium:progress:joyful`  → step index integer
`rosarium:last-mystery`     → mystery key string
```

---

## Audio Playback

### Asset Naming

```
/audios/{locale}/{gender}/{prayerKey}.mp3
/timestamps/{locale}/{gender}/{prayerKey}.json
```

Example: `/audios/pt-br/female/ave-maria.mp3`

### Timestamp Format

```json
[
  { "word": "Ave", "start": 0.0, "end": 0.42 },
  { "word": "Maria,", "start": 0.42, "end": 0.91 }
]
```

### Playback Hook (`use-rosary-player`)

Runs a `requestAnimationFrame` loop instead of relying on the `timeupdate` event (~4 Hz) to get smooth per-frame word highlighting:

```
RAF loop
  read audio.currentTime
  find activeWordIndex (strict: start ≤ t < end)
  find lastStartedIndex (last word whose start ≤ t)
  setState → re-render
```

Two indices exist because a word might have silence after it. `lastStartedIndex` keeps the last word visually highlighted during gaps; `activeWordIndex` is null during gaps (used for scroll-into-view logic).

**Seek-to-word:** Clicking a word calls `audio.currentTime = word.start`, which also updates the RAF loop position immediately.

---

## Theming & Styling

Tailwind v4 uses CSS custom properties instead of a config file. All base tokens live in `app/globals.css`:

```css
:root {
  --ink: ...; /* primary text */
  --bone: ...; /* background */
  --gold: ...; /* accent (overwritten at runtime) */
  --line: ...; /* borders */
  --muted: ...; /* secondary text */
}
```

`SettingsProvider` overwrites `--gold`, `--gold-dim`, `--gold-soft` at runtime from `config/accents.ts` based on the selected accent and theme:

```typescript
// accents.ts structure
ACCENT_VARS = {
  gold: {
    dark:  { gold: "#c6a15b", dim: "...", soft: "..." },
    light: { gold: "#8a6830", dim: "...", soft: "..." },
  },
  ...
}
```

Three accent palettes: `gold`, `wine`, `moss`.

---

## i18n

`next-intl` with two message namespaces:

| Namespace | Path                         | Contents                                       |
| --------- | ---------------------------- | ---------------------------------------------- |
| `ui`      | `i18n/ui/{locale}.json`      | Nav labels, settings text, keyboard shortcuts  |
| `prayers` | `i18n/prayers/{locale}.json` | Mystery names, decade titles, prayer step text |

The locale is read from the `rosarium-settings` cookie in `i18n/request.ts` and injected into the Next.js request context. Client components call `useTranslations("namespace")`.

---

## Component Hierarchy

```
app/layout.tsx
  └─ SettingsProvider (context)
      └─ NextIntlClientProvider
          ├─ HomeTemplate
          │   ├─ AppSidebar
          │   ├─ MysteryCarousel
          │   │   └─ MysteryCard ×4
          │   └─ SettingsDrawer
          └─ PrayerTemplate
              ├─ AppSidebar
              ├─ PrayerWord ×n (word-highlighted text)
              ├─ PrayerRail (decade nav sidebar)
              ├─ SpeedControl
              └─ SettingsDrawer
```

---

## Known Gaps / Roadmap

These are open areas suitable for first contributions:

| Area                     | Status           | Notes                                                                                       |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------- |
| Test suite               | Missing          | No test runner configured. Vitest + Testing Library recommended.                            |
| PWA manifest             | Missing          | `manifest.json` and service worker needed for install prompt and offline support            |
| Prayer history           | Hardcoded        | Home stats (streak, last prayer, avg duration) are static; needs localStorage-based tracker |
| Donation links           | Empty            | `DonateModal` has placeholder constants for PIX, Ko-fi, Buy Me a Coffee                     |
| CI pipeline              | Missing          | No GitHub Actions workflow; needs lint + build checks on PRs                                |
| Error boundaries         | Missing          | No React error boundaries; audio load failures are silent                                   |
| More locales             | Wanted           | Spanish, Italian, French, German, Polish all have large Catholic populations                |
| Glorious mysteries audio | Possibly missing | Verify all 4 mystery sets have complete audio for all locales                               |

---

## Decision Log

**Why localStorage for progress, not a server DB?**
No account system is planned. localStorage is zero-friction and works offline. A future "sync" feature could layer on top.

**Why cookies for settings, not localStorage?**
Settings must survive server render to avoid theme flash. Cookies are the only client storage readable by Next.js server components.

**Why RAF loop instead of `timeupdate`?**
`timeupdate` fires ~4 times per second, which causes visible lag on fast speech. RAF gives frame-accurate (~60fps) word highlighting.

**Why Tailwind v4 CSS-first?**
No config file to maintain. Tokens live in CSS where they belong, and runtime overrides (`--gold` etc.) work naturally as CSS custom properties.

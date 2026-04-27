# Rosarium Today

A free, open-source rosary prayer PWA — word-by-word guided audio, multiple languages, no account required.

**Live:** [rosarium.today](https://rosarium.today)

---

## Features

- Word-level highlighted audio playback (Latin, Portuguese, English)
- Male and female voice options
- Automatic mystery selection by day of the week
- Progress saved locally — no account, no server
- Dark/light themes with three accent palettes
- Fully keyboard-navigable
- Offline-capable PWA (installable on mobile and desktop)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first) |
| Components | shadcn/ui + Radix UI |
| Animation | Framer Motion |
| i18n | next-intl |
| Audio | Native `<audio>` + word-timestamp JSON |

---

## Getting Started

**Prerequisites:** Node.js 20+, npm 10+

```bash
git clone https://github.com/your-org/rosarium-today.git
cd rosarium-today
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Available Commands

```bash
npm run dev        # Dev server with hot reload
npm run build      # Production build
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
```

---

## Project Structure

```
rosarium-today/
├── app/                    # Next.js App Router (pages + server actions)
│   ├── actions/            # Server actions (settings cookie)
│   ├── prayer/[mystery]/   # Dynamic prayer route
│   ├── layout.tsx          # Root layout — fonts, providers, SSR settings
│   ├── page.tsx            # Home page
│   └── globals.css         # Tailwind v4 theme tokens
├── components/             # Atomic Design component tree
│   ├── atoms/              # Primitives (Button, BeadViz, Tooltip, Kbd)
│   ├── molecules/          # Compositions (MysteryCard, PrayerRail, SpeedControl)
│   ├── organisms/          # Feature sections (AppSidebar, SettingsDrawer)
│   └── templates/          # Page layouts (HomeTemplate, PrayerTemplate)
├── config/                 # Constants and domain config
│   ├── accents.ts          # Accent color palettes (gold, wine, moss)
│   ├── locales.ts          # Supported locales
│   ├── rosary.ts           # Mystery types, day-of-week mapping, gradients
│   └── settings.ts         # AppSettings type, defaults, cookie serialization
├── hooks/                  # Custom React hooks
│   ├── use-rosary-player.ts    # Audio playback + word-level timestamps
│   └── use-rosary-progress.ts  # Step navigation + localStorage persistence
├── i18n/                   # Translation files
│   ├── prayers/            # Mystery names and prayer texts (en, pt-br, la)
│   └── ui/                 # Interface strings (en, pt-br, la)
├── player/                 # Domain logic
│   ├── assets.ts           # Audio/timestamp URL helpers
│   └── rosary-steps.ts     # 79-step rosary structure definition
├── providers/              # React context
│   └── SettingsProvider.tsx
├── public/audios/          # Audio files (Latin, pt-br × male/female)
├── public/timestamps/      # Word-level timing JSON files
└── utils/                  # Shared utilities
```

For a deep dive into architecture decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Contributing

Pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, conventions, and open issues.

For significant changes, open an issue first to discuss the approach.

---

## Internationalization

Three locales are supported: English (`en`), Brazilian Portuguese (`pt-br`), and Latin (`la`).

To add a new locale:
1. Add the locale key to `config/locales.ts`
2. Create `i18n/ui/{locale}.json` and `i18n/prayers/{locale}.json`
3. Add audio files to `public/audios/{locale}/`
4. Add timestamp JSON to `public/timestamps/{locale}/`

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-a-language) for the full guide.

---

## License

[MIT](./LICENSE)

<div align="center">

# ✝ Rosarium Today

**Free, open-source rosary prayer PWA — word-by-word guided audio, three languages, no account required.**

[![Live](https://img.shields.io/badge/live-rosarium.today-D4AF37?style=flat-square)](https://rosarium.today)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![next-intl](https://img.shields.io/badge/next--intl-4-EC4899?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-ready-7C3AED?style=flat-square)

🇬🇧 English · [🇧🇷 Português](./README.pt-br.md) · [🏛️ Latina](./README.la.md)

</div>

---

## Features

- 🎵 Word-level highlighted audio playback (Latin, Portuguese, English)
- 🎙️ Male and female voice options
- 📅 Automatic mystery selection by day of the week
- 💾 Progress saved locally — no account, no server
- 🎨 Dark/light themes with three accent palettes (gold, wine, moss)
- ⌨️ Fully keyboard-navigable
- 📱 Offline-capable PWA — installable on mobile and desktop

---

## Stack

| Layer       | Tech                                   |
| ----------- | -------------------------------------- |
| Framework   | Next.js 16 (App Router)                |
| Language    | TypeScript 5                           |
| Styling     | Tailwind CSS v4 (CSS-first)            |
| Components  | shadcn/ui + Radix UI                   |
| Animation   | Framer Motion                          |
| i18n        | next-intl 4                            |
| Audio       | Native `<audio>` + word-timestamp JSON |

---

## Getting Started

**Prerequisites:** Node.js 20+, npm 10+

```bash
git clone https://github.com/Brendovisk/rosarium-today.git
cd rosarium-today
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Commands

```bash
npm run dev        # Dev server with hot reload
npm run build      # Production build
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
npm test           # Run test suite
```

---

## Project Structure

```
rosarium-today/
├── app/                    # Next.js App Router (pages + server actions)
├── components/             # Atomic Design component tree
│   ├── atoms/              # Primitives (Button, BeadViz, Tooltip, Kbd)
│   ├── molecules/          # Compositions (MysteryCard, PrayerRail, SpeedControl)
│   ├── organisms/          # Feature sections (AppSidebar, SettingsDrawer)
│   └── templates/          # Page layouts (HomeTemplate, PrayerTemplate)
├── config/                 # Constants and domain config
├── hooks/                  # Custom React hooks
├── i18n/                   # Translation files (en, pt-br, la)
├── providers/              # React context (SettingsProvider)
└── public/                 # Audio files and word-timestamp JSON
```

---

## Internationalization

Three locales supported: `en`, `pt-br`, `la`.

To add a locale:

1. Add the key to `config/locales.ts`
2. Create `i18n/ui/{locale}.json` and `i18n/prayers/{locale}.json`
3. Add audio files to `public/audios/{locale}/`
4. Add timestamp JSON to `public/timestamps/{locale}/`

---

## Contributing

Pull requests are welcome. For significant changes, open an issue first to discuss the approach.

---

## License

[MIT](./LICENSE)

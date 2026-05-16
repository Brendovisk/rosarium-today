<div align="center">

# ✝ Rosarium Hodie

**PWA liberum et apertum pro precatione Rosarii — audio singularum verborum cum lucibus, tribus linguis, sine inscriptione necessaria.**

[![In Vivo](https://img.shields.io/badge/in_vivo-rosarium.today-D4AF37?style=flat-square)](https://rosarium.today)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![next-intl](https://img.shields.io/badge/next--intl-4-EC4899?style=flat-square)
![Licentia](https://img.shields.io/badge/licentia-MIT-22C55E?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-paratum-7C3AED?style=flat-square)

[🇬🇧 English](./README.md) · [🇧🇷 Português](./README.pt-br.md) · 🏛️ Latina

</div>

---

## Proprietates

- 🎵 Audio recitationis cum verbis lucidis (Latina, Lusitanica, Anglica)
- 🎙️ Vox mascula et feminea
- 📅 Mysteria secundum diem automatice eliguntur
- 💾 Progressus localiter servatur — sine ratione, sine servo
- 🎨 Themata obscura et lucida cum tribus coloribus (aurum, vinum, muscus)
- ⌨️ Per claviaturam plene navigabile
- 📱 PWA ad usum extra retis — in machina mobili et computatro installabile

---

## Artes Adhibitae

| Stratum     | Ars                                    |
| ----------- | -------------------------------------- |
| Systema     | Next.js 16 (App Router)                |
| Lingua      | TypeScript 5                           |
| Ornatus     | Tailwind CSS v4 (CSS-first)            |
| Partes      | shadcn/ui + Radix UI                   |
| Motus       | Framer Motion                          |
| Linguae     | next-intl 4                            |
| Audio       | `<audio>` nativus + JSON temporis      |

---

## Ad Incipiendum

**Praerequisita:** Node.js 20+, npm 10+

```bash
git clone https://github.com/Brendovisk/rosarium-today.git
cd rosarium-today
npm install
npm run dev
```

Aperi [http://localhost:3000](http://localhost:3000).

### Mandata

```bash
npm run dev        # Servitor cum renovatione calida
npm run build      # Aedificatio ad usum finalem
npm run lint       # ESLint exsequere
npm run lint:fix   # Vitia ESLint automatice emendare
npm test           # Experimenta exsequere
```

---

## Structura Proiecti

```
rosarium-today/
├── app/                    # Next.js App Router (paginae + actiones)
├── components/             # Partes (Atomic Design)
│   ├── atoms/              # Primitiva (Button, BeadViz, Tooltip, Kbd)
│   ├── molecules/          # Compositiones (MysteryCard, PrayerRail, SpeedControl)
│   ├── organisms/          # Sectiones (AppSidebar, SettingsDrawer)
│   └── templates/          # Schemate paginarum (HomeTemplate, PrayerTemplate)
├── config/                 # Constantia et configurationes
├── hooks/                  # Hami React proprii
├── i18n/                   # Versiones linguarum (en, pt-br, la)
├── providers/              # Contextus React (SettingsProvider)
└── public/                 # Files audio et JSON temporis
```

---

## Linguae

Tres linguae sustentantur: `en`, `pt-br`, `la`.

Ad linguam novam addendam:

1. Clavem in `config/locales.ts` adde
2. Crea `i18n/ui/{locale}.json` et `i18n/prayers/{locale}.json`
3. Audios in `public/audios/{locale}/` adde
4. Temporis notitias in `public/timestamps/{locale}/` adde

---

## Collaboratio

Precationes mutationis (pull requests) gratae sunt. Pro mutationibus magnis, quaestionem prius aperi.

---

## Licentia

[MIT](./LICENSE)

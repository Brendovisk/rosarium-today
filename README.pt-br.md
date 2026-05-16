<div align="center">

# ✝ Rosarium Today

**PWA gratuito e open-source para oração do rosário — áudio guiado palavra por palavra, três idiomas, sem cadastro.**

[![Ao Vivo](https://img.shields.io/badge/ao_vivo-rosarium.today-D4AF37?style=flat-square)](https://rosarium.today)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![next-intl](https://img.shields.io/badge/next--intl-4-EC4899?style=flat-square)
![Licença](https://img.shields.io/badge/licença-MIT-22C55E?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-pronto-7C3AED?style=flat-square)

[🇬🇧 English](./README.md) · 🇧🇷 Português · [🏛️ Latina](./README.la.md)

</div>

---

## Funcionalidades

- 🎵 Reprodução de áudio com destaque palavra por palavra (Latim, Português, Inglês)
- 🎙️ Opções de voz masculina e feminina
- 📅 Seleção automática dos mistérios pelo dia da semana
- 💾 Progresso salvo localmente — sem conta, sem servidor
- 🎨 Temas escuro/claro com três paletas de destaque (dourado, vinho, musgo)
- ⌨️ Totalmente navegável pelo teclado
- 📱 PWA instalável offline — no celular e no computador

---

## Tecnologias

| Camada      | Tecnologia                             |
| ----------- | -------------------------------------- |
| Framework   | Next.js 16 (App Router)                |
| Linguagem   | TypeScript 5                           |
| Estilos     | Tailwind CSS v4 (CSS-first)            |
| Componentes | shadcn/ui + Radix UI                   |
| Animações   | Framer Motion                          |
| i18n        | next-intl 4                            |
| Áudio       | `<audio>` nativo + JSON com timestamps |

---

## Primeiros Passos

**Pré-requisitos:** Node.js 20+, npm 10+

```bash
git clone https://github.com/Brendovisk/rosarium-today.git
cd rosarium-today
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Comandos

```bash
npm run dev        # Servidor de desenvolvimento com hot reload
npm run build      # Build de produção
npm run lint       # Executar ESLint
npm run lint:fix   # Corrigir problemas do ESLint automaticamente
npm test           # Executar testes
```

---

## Estrutura do Projeto

```
rosarium-today/
├── app/                    # Next.js App Router (páginas + server actions)
├── components/             # Árvore de componentes (Atomic Design)
│   ├── atoms/              # Primitivos (Button, BeadViz, Tooltip, Kbd)
│   ├── molecules/          # Composições (MysteryCard, PrayerRail, SpeedControl)
│   ├── organisms/          # Seções de funcionalidade (AppSidebar, SettingsDrawer)
│   └── templates/          # Layouts de página (HomeTemplate, PrayerTemplate)
├── config/                 # Constantes e configurações de domínio
├── hooks/                  # React hooks customizados
├── i18n/                   # Arquivos de tradução (en, pt-br, la)
├── providers/              # Contexto React (SettingsProvider)
└── public/                 # Arquivos de áudio e JSON de timestamps
```

---

## Internacionalização

Três idiomas suportados: `en`, `pt-br`, `la`.

Para adicionar um idioma:

1. Adicione a chave em `config/locales.ts`
2. Crie `i18n/ui/{locale}.json` e `i18n/prayers/{locale}.json`
3. Adicione áudios em `public/audios/{locale}/`
4. Adicione timestamps em `public/timestamps/{locale}/`

---

## Contribuição

Pull requests são bem-vindos. Para mudanças significativas, abra uma issue primeiro para discutir a abordagem.

---

## Licença

[MIT](./LICENSE)

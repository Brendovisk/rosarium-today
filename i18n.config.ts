export const locales = ['la', 'pt-BR'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'la'

export const localeLabels: Record<Locale, string> = {
  la: 'Latine',
  'pt-BR': 'Português',
}

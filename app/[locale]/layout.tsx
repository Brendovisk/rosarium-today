import { NextIntlClientProvider } from 'next-intl'
import { locales } from '@/i18n.config'
import type { Locale } from '@/i18n.config'
import { SettingsProvider } from '@/contexts/SettingsContext'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Rosarium',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale: Locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : 'la'

  const messages = (await import(`../../public/messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages} now={new Date()} timeZone="UTC">
      <SettingsProvider initialLocale={locale}>{children}</SettingsProvider>
    </NextIntlClientProvider>
  )
}

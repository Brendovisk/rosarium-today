import { notFound } from 'next/navigation'
import { PrayerTemplate } from '@/components/templates/PrayerTemplate'
import { isMysteryKey } from '@/lib/rosary'
import type { Locale } from '@/i18n.config'

interface PrayerPageProps {
  params: Promise<{ locale: Locale; mystery: string }>
}

export default async function PrayerPage({ params }: PrayerPageProps) {
  const { locale, mystery } = await params

  if (!isMysteryKey(mystery)) {
    notFound()
  }

  return <PrayerTemplate locale={locale} mysteryKey={mystery} />
}

import { HomeTemplate } from '@/components/templates/HomeTemplate'
import { getTodaysMystery } from '@/lib/rosary'
import type { Locale } from '@/i18n.config'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const todaysMystery = getTodaysMystery()

  return <HomeTemplate locale={locale} todaysMystery={todaysMystery} />
}

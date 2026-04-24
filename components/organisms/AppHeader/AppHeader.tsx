'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CrossIcon } from '@/components/atoms/CrossIcon'
import { useSettings } from '@/contexts/SettingsContext'
import { localeLabels } from '@/i18n.config'
import type { Locale } from '@/i18n.config'

interface AppHeaderProps {
  locale: Locale
  backHref?: string
  mysteryName?: string
}

export function AppHeader({ locale, backHref, mysteryName }: AppHeaderProps) {
  const t = useTranslations('nav')
  const { voiceGender, setVoiceGender } = useSettings()

  const otherLocale: Locale = locale === 'la' ? 'pt-BR' : 'la'
  const otherLocaleLabel = localeLabels[otherLocale]
  const currentLocaleLabel = localeLabels[locale]

  return (
    <header className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-gold/[0.08]">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link href={backHref} className="flex items-center gap-2 text-muted-2 hover:text-muted transition-colors duration-200">
            <ChevronLeft size={16} />
            <span className="text-[10px] tracking-[0.2em] uppercase">{t('title')}</span>
          </Link>
        ) : (
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <CrossIcon size={14} className="text-gold group-hover:drop-shadow-[0_0_4px_rgba(198,161,91,0.8)] transition-all duration-300" />
            <span className="font-caps text-sm font-semibold tracking-[0.2em] uppercase text-bone">{t('title')}</span>
          </Link>
        )}
        {mysteryName && (
          <>
            <span className="text-line-2">·</span>
            <span className="font-caps text-xs tracking-[0.15em] uppercase text-muted">{mysteryName}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setVoiceGender(voiceGender === 'male' ? 'female' : 'male')}
          className="rounded px-3 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase transition-all text-muted-2 hover:text-muted hover:bg-white/5"
          title={voiceGender === 'male' ? 'Vox Masculina' : 'Vox Feminina'}
        >
          {voiceGender === 'male' ? '♂' : '♀'}
        </button>
        <div className="mx-2 h-3.5 w-px bg-gold/[0.15]" />
        <span className="rounded px-3 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase bg-gold-soft text-gold ring-1 ring-gold-dim">
          {currentLocaleLabel}
        </span>
        <Link href={`/${otherLocale}`} className="rounded px-3 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-muted-2 hover:text-muted hover:bg-white/5 transition-all">
          {otherLocaleLabel}
        </Link>
      </div>
    </header>
  )
}

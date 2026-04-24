'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Moon, Sun, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useSettings } from '@/contexts/SettingsContext'
import { ACCENT_OPTIONS } from '@/lib/constants/accents'
import { LOCALE_OPTIONS } from '@/lib/constants/locales'
import type { Locale } from '@/i18n.config'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
  locale: Locale
}

const SECTION_LABEL = 'font-ui text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-3.5'

export function SettingsDrawer({ open, onClose, locale }: SettingsDrawerProps) {
  const t = useTranslations('settings')
  const { theme, accent, setAccent, setTheme } = useSettings()
  const router = useRouter()

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return
    const newPath = window.location.pathname.replace(`/${locale}`, `/${newLocale}`)
    onClose()
    router.push(newPath)
  }

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 bg-black/50 z-[90] transition-opacity duration-250',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />
      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 w-[400px] bg-ink-2 border-l border-line z-[91]',
          'shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.6)]',
          'transition-transform duration-[320ms] ease-[cubic-bezier(.2,.7,.2,1)]',
          'p-[32px_36px] overflow-y-auto flex flex-col gap-8',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <div className="font-ui text-[10px] font-bold tracking-[0.26em] uppercase text-gold">{t('title')}</div>
            <div className="font-display font-normal text-[30px] mt-1">{t('heading')}</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full border border-line bg-white/3 text-muted hover:text-bone hover:border-gold-dim transition-colors" aria-label="Fechar">
            <X size={16} />
          </button>
        </header>

        {/* Theme */}
        <section>
          <div className={SECTION_LABEL}>{t('theme')}</div>
          <div className="flex gap-2.5">
            {([
              { value: 'dark'  as const, label: t('dark'),  sub: t('darkSub'),  Icon: Moon },
              { value: 'light' as const, label: t('light'), sub: t('lightSub'), Icon: Sun  },
            ]).map(({ value, label, sub, Icon }) => {
              const active = theme === value
              return (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex-1 p-[18px_14px] rounded-[14px] border flex flex-col gap-2.5 items-center transition-all text-bone',
                    active ? 'border-gold bg-gold-soft' : 'border-line bg-transparent hover:border-line-2',
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-full grid place-items-center border border-line',
                    value === 'light' ? 'bg-[#f0e6d2] text-[#8c6b2a]' : 'bg-[#1a1410] text-gold',
                  )}>
                    <Icon size={14} />
                  </span>
                  <span className="font-display text-[15px] leading-none">{label}</span>
                  <span className="font-ui text-[10px] tracking-[0.14em] uppercase text-muted-2">{sub}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Accent */}
        <section>
          <div className={SECTION_LABEL}>{t('accentColor')}</div>
          <div className="flex gap-2.5">
            {ACCENT_OPTIONS.map(({ value, swatch }) => {
              const active = accent === value
              return (
                <button
                  key={value}
                  onClick={() => setAccent(value)}
                  className={cn(
                    'flex-1 p-[18px_14px] rounded-[14px] border flex flex-col gap-2.5 items-center transition-all',
                    active ? 'border-gold bg-gold-soft' : 'border-line bg-transparent hover:border-line-2',
                  )}
                >
                  <span className="w-7 h-7 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" style={{ background: swatch }} />
                  <span className="font-ui text-[12px] text-bone">{t(value as 'gold' | 'wine' | 'moss')}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* UI Language */}
        <section>
          <div className={SECTION_LABEL}>{t('uiLanguage')}</div>
          <div className="flex flex-col gap-1.5">
            {LOCALE_OPTIONS.map(({ value, label }) => {
              const active = locale === value
              return (
                <button
                  key={value}
                  onClick={() => handleLocaleChange(value)}
                  className={cn(
                    'p-[14px_16px] rounded-[10px] border flex justify-between items-center',
                    'font-display text-[17px] text-bone transition-all',
                    active ? 'border-gold bg-gold-soft' : 'border-line bg-transparent hover:border-line-2',
                  )}
                >
                  <span>{label}</span>
                  {active && <span className="text-gold text-[18px]">✓</span>}
                </button>
              )
            })}
          </div>
        </section>

        {/* Prayer Language */}
        <section>
          <div className={SECTION_LABEL}>{t('prayerLanguage')}</div>
          <div className="flex flex-col gap-1.5">
            {LOCALE_OPTIONS.map(({ value, label }) => {
              const active = locale === value
              return (
                <button
                  key={value}
                  onClick={() => handleLocaleChange(value)}
                  className={cn(
                    'p-[14px_16px] rounded-[10px] border flex justify-between items-center',
                    'font-display text-[17px] text-bone transition-all',
                    active ? 'border-gold bg-gold-soft' : 'border-line bg-transparent hover:border-line-2',
                  )}
                >
                  <span>{label}</span>
                  {active && <span className="text-gold text-[18px]">✓</span>}
                </button>
              )
            })}
          </div>
        </section>

        <div className="mt-auto pt-6 border-t border-line font-display italic text-[13px] text-muted-2 text-center">
          {t('footerQuote')}
        </div>
      </aside>
    </>
  )
}

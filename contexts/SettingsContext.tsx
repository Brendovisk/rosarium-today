'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Locale } from '@/i18n.config'
import type { VoiceGender } from '@/lib/prayers'
import type { AccentColor } from '@/lib/storage'
import { loadSettings, saveSettings } from '@/lib/storage'
import { ACCENT_VARS } from '@/lib/constants/accents'

interface Settings {
  locale: Locale
  voiceGender: VoiceGender
  theme: 'dark' | 'light'
  accent: AccentColor
}

interface SettingsContextValue extends Settings {
  setLocale: (locale: Locale) => void
  setVoiceGender: (gender: VoiceGender) => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  setAccent: (accent: AccentColor) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

interface SettingsProviderProps {
  children: React.ReactNode
  initialLocale: Locale
}

export function SettingsProvider({ children, initialLocale }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') {
      return { locale: initialLocale, voiceGender: 'female', theme: 'dark', accent: 'gold' }
    }
    const persisted = loadSettings()
    return { ...persisted, locale: initialLocale }
  })

  useEffect(() => {
    setSettings((prev) => ({ ...prev, locale: initialLocale }))
  }, [initialLocale])

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', settings.theme === 'light')
  }, [settings.theme])

  // Apply accent CSS variables to html element
  useEffect(() => {
    const vars = ACCENT_VARS[settings.accent]
    const root = document.documentElement
    root.style.setProperty('--gold', vars.gold)
    root.style.setProperty('--gold-dim', vars.dim)
    root.style.setProperty('--gold-soft', vars.soft)
  }, [settings.accent])

  const setLocale = useCallback((locale: Locale) => {
    setSettings((prev) => ({ ...prev, locale }))
    saveSettings({ locale })
  }, [])

  const setVoiceGender = useCallback((voiceGender: VoiceGender) => {
    setSettings((prev) => ({ ...prev, voiceGender }))
    saveSettings({ voiceGender })
  }, [])

  const setTheme = useCallback((theme: 'dark' | 'light') => {
    setSettings((prev) => ({ ...prev, theme }))
    saveSettings({ theme })
  }, [])

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const next = prev.theme === 'light' ? 'dark' : 'light'
      saveSettings({ theme: next })
      return { ...prev, theme: next }
    })
  }, [])

  const setAccent = useCallback((accent: AccentColor) => {
    setSettings((prev) => ({ ...prev, accent }))
    saveSettings({ accent })
  }, [])

  return (
    <SettingsContext.Provider
      value={{ ...settings, setLocale, setVoiceGender, setTheme, toggleTheme, setAccent }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

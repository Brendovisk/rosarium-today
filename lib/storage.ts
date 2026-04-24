import type { Locale } from '@/i18n.config'
import type { VoiceGender } from './prayers'
import type { MysteryKey } from './rosary'

export interface RosaryProgress {
  readonly mysteryKey: MysteryKey
  readonly stepIndex: number
}

export type AccentColor = 'gold' | 'wine' | 'moss'

export interface PersistedSettings {
  readonly locale: Locale
  readonly voiceGender: VoiceGender
  readonly theme: 'dark' | 'light'
  readonly accent: AccentColor
}

export interface PersistedProgress {
  readonly [mysteryKey: string]: number
}

const SETTINGS_KEY = 'rosarium:settings'
const PROGRESS_KEY = 'rosarium:progress'

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage may be unavailable (SSR, private mode, quota exceeded)
  }
}

const DEFAULT_SETTINGS: PersistedSettings = {
  locale: 'la',
  voiceGender: 'female',
  theme: 'dark',
  accent: 'gold',
}

export function loadSettings(): PersistedSettings {
  return { ...DEFAULT_SETTINGS, ...safeRead<Partial<PersistedSettings>>(SETTINGS_KEY, {}) }
}

export function saveSettings(settings: Partial<PersistedSettings>): void {
  const current = loadSettings()
  safeWrite(SETTINGS_KEY, { ...current, ...settings })
}

export function loadProgress(): PersistedProgress {
  return safeRead<PersistedProgress>(PROGRESS_KEY, {})
}

export function saveProgress(mysteryKey: MysteryKey, stepIndex: number): void {
  const current = loadProgress()
  safeWrite(PROGRESS_KEY, { ...current, [mysteryKey]: stepIndex })
}

export function clearProgress(mysteryKey?: MysteryKey): void {
  if (mysteryKey) {
    const current = loadProgress()
    const updated = { ...current }
    delete updated[mysteryKey]
    safeWrite(PROGRESS_KEY, updated)
  } else {
    safeWrite(PROGRESS_KEY, {})
  }
}

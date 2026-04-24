import type { Locale } from '@/i18n.config'

export type PrayerKey =
  | 'signum-crucis'
  | 'symbolum-apostolorum'
  | 'pater-noster'
  | 'ave-maria'
  | 'gloria-patri'
  | 'oratio-fatima'
  | 'salve-regina'
  | 'intercessio-mariae'

export type VoiceGender = 'male' | 'female'

export interface WordTimestamp {
  readonly word: string
  readonly start: number
  readonly end: number
}

const LOCALE_TO_AUDIO_DIR: Record<Locale, string> = {
  la: 'latin',
  'pt-BR': 'pt-br',
}

const PRAYER_FILE_STEM: Record<PrayerKey, string> = {
  'signum-crucis': 'signum-crucis',
  'symbolum-apostolorum': 'symbolum-apostolorum',
  'pater-noster': 'pater-noster',
  'ave-maria': 'ave-maria',
  'gloria-patri': 'doxologia-minor',
  'oratio-fatima': 'oratio-fatima',
  'salve-regina': 'salve-regina',
  'intercessio-mariae': 'intercessio-mariae',
}

export function getAudioUrl(prayerKey: PrayerKey, locale: Locale, gender: VoiceGender): string {
  const langDir = LOCALE_TO_AUDIO_DIR[locale]
  const stem = PRAYER_FILE_STEM[prayerKey]
  return `/audios/${langDir}/${gender}/${stem}.mp3`
}

export function getTimestampUrl(
  prayerKey: PrayerKey,
  locale: Locale,
  gender: VoiceGender,
): string {
  const langDir = LOCALE_TO_AUDIO_DIR[locale]
  const stem = PRAYER_FILE_STEM[prayerKey]
  return `/timestamps/${langDir}/${gender}/${stem}.json`
}

export async function fetchTimestamps(
  prayerKey: PrayerKey,
  locale: Locale,
  gender: VoiceGender,
): Promise<WordTimestamp[]> {
  const url = getTimestampUrl(prayerKey, locale, gender)
  const response = await fetch(url)
  if (!response.ok) return []
  return response.json() as Promise<WordTimestamp[]>
}

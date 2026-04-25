import type { SupportedLocale } from "@/config/locales";
import type { VoiceGender } from "@/config/settings";

export type PrayerKey =
  | "signum-crucis"
  | "symbolum-apostolorum"
  | "pater-noster"
  | "ave-maria"
  | "gloria-patri"
  | "oratio-fatima"
  | "salve-regina"
  | "intercessio-mariae";

export interface WordTimestamp {
  readonly word: string;
  readonly start: number;
  readonly end: number;
}

// English UI uses pt-br audio since no English recordings exist.
const LOCALE_TO_ASSET_DIR: Record<SupportedLocale, string> = {
  en: "pt-br",
  "pt-br": "pt-br",
  la: "latin",
};

const PRAYER_FILE_STEM: Record<PrayerKey, string> = {
  "signum-crucis": "signum-crucis",
  "symbolum-apostolorum": "symbolum-apostolorum",
  "pater-noster": "pater-noster",
  "ave-maria": "ave-maria",
  "gloria-patri": "doxologia-minor",
  "oratio-fatima": "oratio-fatima",
  "salve-regina": "salve-regina",
  "intercessio-mariae": "intercessio-mariae",
};

export function getAudioUrl(
  prayerKey: PrayerKey,
  locale: SupportedLocale,
  gender: VoiceGender
) {
  return `/audios/${LOCALE_TO_ASSET_DIR[locale]}/${gender}/${PRAYER_FILE_STEM[prayerKey]}.mp3`;
}

export function getTimestampUrl(
  prayerKey: PrayerKey,
  locale: SupportedLocale,
  gender: VoiceGender
) {
  return `/timestamps/${LOCALE_TO_ASSET_DIR[locale]}/${gender}/${PRAYER_FILE_STEM[prayerKey]}.json`;
}

export async function fetchTimestamps(
  prayerKey: PrayerKey,
  locale: SupportedLocale,
  gender: VoiceGender
): Promise<WordTimestamp[]> {
  const response = await fetch(getTimestampUrl(prayerKey, locale, gender));

  if (!response.ok) return [];

  return response.json() as Promise<WordTimestamp[]>;
}

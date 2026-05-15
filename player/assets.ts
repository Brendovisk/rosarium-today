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
  | "miraculous-medal";

export type WordTimestamp = {
  readonly word: string;
  readonly start: number;
  readonly end: number;
};

const LOCALE_TO_ASSET_DIR: Record<SupportedLocale, string> = {
  en: "en",
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
  "miraculous-medal": "miraculous-medal",
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

export const fetchTimestamps = async (
  prayerKey: PrayerKey,
  locale: SupportedLocale,
  gender: VoiceGender
): Promise<WordTimestamp[]> => {
  try {
    const response = await fetch(getTimestampUrl(prayerKey, locale, gender));

    if (!response.ok) return [];

    const data: unknown = await response.json();

    return Array.isArray(data) ? (data as WordTimestamp[]) : [];
  } catch {
    return [];
  }
};

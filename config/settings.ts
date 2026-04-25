import { type AccentColor, isAccentColor } from "@/config/accents";
import { isSupportedLocale, type SupportedLocale } from "@/config/locales";

export const SETTINGS_COOKIE_NAME = "rosarium-settings";

export const THEME_PREFERENCES = ["dark", "light"] as const;
export const VOICE_GENDERS = ["female", "male"] as const;
export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type VoiceGender = (typeof VOICE_GENDERS)[number];
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export type AppSettings = {
  theme: ThemePreference;
  accent: AccentColor;
  uiLanguage: SupportedLocale;
  prayerLanguage: SupportedLocale;
  voiceGender: VoiceGender;
  autoPlay: boolean;
  playbackRate: PlaybackRate;
  leftMenuCollapsed: boolean;
  rightMenuCollapsed: boolean;
  prayerRailCollapsed: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  accent: "gold",
  uiLanguage: "en",
  prayerLanguage: "en",
  voiceGender: "female",
  autoPlay: false,
  playbackRate: 1,
  leftMenuCollapsed: false,
  rightMenuCollapsed: true,
  prayerRailCollapsed: false,
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
}

export function isVoiceGender(value: unknown): value is VoiceGender {
  return VOICE_GENDERS.includes(value as VoiceGender);
}

export function isPlaybackRate(value: unknown): value is PlaybackRate {
  return PLAYBACK_RATES.includes(value as PlaybackRate);
}

export function normalizeSettings(settings: unknown): AppSettings {
  if (!settings || typeof settings !== "object") {
    return DEFAULT_SETTINGS;
  }

  const partialSettings = settings as Partial<AppSettings>;

  return {
    theme: isThemePreference(partialSettings.theme)
      ? partialSettings.theme
      : DEFAULT_SETTINGS.theme,
    accent: isAccentColor(partialSettings.accent)
      ? partialSettings.accent
      : DEFAULT_SETTINGS.accent,
    uiLanguage: isSupportedLocale(partialSettings.uiLanguage)
      ? partialSettings.uiLanguage
      : DEFAULT_SETTINGS.uiLanguage,
    prayerLanguage: isSupportedLocale(partialSettings.prayerLanguage)
      ? partialSettings.prayerLanguage
      : DEFAULT_SETTINGS.prayerLanguage,
    voiceGender: isVoiceGender(partialSettings.voiceGender)
      ? partialSettings.voiceGender
      : DEFAULT_SETTINGS.voiceGender,
    autoPlay:
      typeof partialSettings.autoPlay === "boolean"
        ? partialSettings.autoPlay
        : DEFAULT_SETTINGS.autoPlay,
    playbackRate: isPlaybackRate(partialSettings.playbackRate)
      ? partialSettings.playbackRate
      : DEFAULT_SETTINGS.playbackRate,
    leftMenuCollapsed:
      typeof partialSettings.leftMenuCollapsed === "boolean"
        ? partialSettings.leftMenuCollapsed
        : DEFAULT_SETTINGS.leftMenuCollapsed,
    rightMenuCollapsed:
      typeof partialSettings.rightMenuCollapsed === "boolean"
        ? partialSettings.rightMenuCollapsed
        : DEFAULT_SETTINGS.rightMenuCollapsed,
    prayerRailCollapsed:
      typeof partialSettings.prayerRailCollapsed === "boolean"
        ? partialSettings.prayerRailCollapsed
        : DEFAULT_SETTINGS.prayerRailCollapsed,
  };
}

export function parseSettingsCookie(cookieValue?: string | null): AppSettings {
  if (!cookieValue) return DEFAULT_SETTINGS;

  try {
    return normalizeSettings(JSON.parse(decodeURIComponent(cookieValue)));
  } catch {
    try {
      return normalizeSettings(JSON.parse(cookieValue));
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}

export function serializeSettingsCookie(settings: AppSettings): string {
  return encodeURIComponent(JSON.stringify(normalizeSettings(settings)));
}

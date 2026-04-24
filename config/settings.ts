import { type AccentColor, isAccentColor } from "@/config/accents";
import { isSupportedLocale, type SupportedLocale } from "@/config/locales";

export const SETTINGS_COOKIE_NAME = "rosarium-settings";

export const THEME_PREFERENCES = ["dark", "light"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type AppSettings = {
  theme: ThemePreference;
  accent: AccentColor;
  uiLanguage: SupportedLocale;
  prayerLanguage: SupportedLocale;
  leftMenuCollapsed: boolean;
  rightMenuCollapsed: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  accent: "gold",
  uiLanguage: "en",
  prayerLanguage: "en",
  leftMenuCollapsed: false,
  rightMenuCollapsed: true,
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
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
    leftMenuCollapsed:
      typeof partialSettings.leftMenuCollapsed === "boolean"
        ? partialSettings.leftMenuCollapsed
        : DEFAULT_SETTINGS.leftMenuCollapsed,
    rightMenuCollapsed:
      typeof partialSettings.rightMenuCollapsed === "boolean"
        ? partialSettings.rightMenuCollapsed
        : DEFAULT_SETTINGS.rightMenuCollapsed,
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

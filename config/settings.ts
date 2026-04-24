import type { AccentColor } from "@/config/accents";
import type { SupportedLocale } from "@/config/locales";

export type AppSettings = {
  accent?: AccentColor;
  uiLanguage?: SupportedLocale;
  prayerLanguage?: SupportedLocale;
};

export const DEFAULT_SETTINGS: AppSettings = {
  accent: "gold",
};

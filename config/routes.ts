import type { SupportedLocale } from "@/config/locales";
import { SUPPORTED_LOCALES } from "@/config/locales";
import type { MysteryKey } from "@/config/rosary";

export const PRAYER_SEGMENT: Record<SupportedLocale, string> = {
  en: "prayer",
  "pt-br": "oracao",
  la: "oratio",
};

export const PRIVACY_SEGMENT: Record<SupportedLocale, string> = {
  en: "privacy",
  "pt-br": "privacidade",
  la: "privata",
};

export const TERMS_SEGMENT: Record<SupportedLocale, string> = {
  en: "terms",
  "pt-br": "termos",
  la: "termini",
};

export const MYSTERY_SLUGS: Record<SupportedLocale, Record<MysteryKey, string>> = {
  en: {
    joyful: "joyful",
    sorrowful: "sorrowful",
    glorious: "glorious",
    luminous: "luminous",
  },
  "pt-br": {
    joyful: "gozosos",
    sorrowful: "dolorosos",
    glorious: "gloriosos",
    luminous: "luminosos",
  },
  la: {
    joyful: "gaudiosa",
    sorrowful: "dolorosa",
    glorious: "gloriosa",
    luminous: "luminosa",
  },
};

export function getLocalizedPrayerPath(
  key: MysteryKey,
  locale: SupportedLocale
): string {
  return `/${PRAYER_SEGMENT[locale]}/${MYSTERY_SLUGS[locale][key]}`;
}

export function getLocalizedPath(
  canonical: string,
  locale: SupportedLocale
): string {
  const prayerMatch = canonical.match(
    /^\/prayer\/(joyful|sorrowful|glorious|luminous)(\/.*)?$/
  );
  if (prayerMatch) {
    const key = prayerMatch[1] as MysteryKey;
    const rest = prayerMatch[2] ?? "";
    return `/${PRAYER_SEGMENT[locale]}/${MYSTERY_SLUGS[locale][key]}${rest}`;
  }
  if (canonical === "/privacy" || canonical.startsWith("/privacy/")) {
    return canonical.replace("/privacy", `/${PRIVACY_SEGMENT[locale]}`);
  }
  if (canonical === "/terms" || canonical.startsWith("/terms/")) {
    return canonical.replace("/terms", `/${TERMS_SEGMENT[locale]}`);
  }
  return canonical;
}

export function getCanonicalPath(path: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    for (const [key, slug] of Object.entries(MYSTERY_SLUGS[locale])) {
      if (path === `/${PRAYER_SEGMENT[locale]}/${slug}`) {
        return `/prayer/${key}`;
      }
    }
    if (path === `/${PRIVACY_SEGMENT[locale]}`) return "/privacy";
    if (path === `/${TERMS_SEGMENT[locale]}`) return "/terms";
  }
  return path;
}

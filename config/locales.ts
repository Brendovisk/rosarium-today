export const SUPPORTED_LOCALES = ["en", "pt-br", "la"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_OPTIONS: { value: SupportedLocale; label: string }[] = [
  { value: "pt-br", label: "Português" },
  { value: "la", label: "Latina" },
  { value: "en", label: "English" },
];

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

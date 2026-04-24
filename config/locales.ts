export type SupportedLocale = "en" | "pt-br" | "la";

export const LOCALE_OPTIONS: { value: SupportedLocale; label: string }[] = [
  { value: "pt-br", label: "Português" },
  { value: "la", label: "Latina" },
  { value: "en", label: "English" },
];

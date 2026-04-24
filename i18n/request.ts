import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const DEFAULT_LOCALE = "en";

const messagesLoaders = {
  en: () => import("./ui/en.json"),
  "pt-br": () => import("./ui/pt-br.json"),
  la: () => import("./ui/la.json"),
} as const;

type SupportedLocale = keyof typeof messagesLoaders;

const getPreferredLocales = (acceptLanguage: string | null) => {
  if (!acceptLanguage) return [];

  return acceptLanguage
    .split(",")
    .map((entry) => {
      const [localePart, ...params] = entry.trim().split(";");
      const qualityParam = params.find((param) =>
        param.trim().startsWith("q=")
      );
      const quality = qualityParam ? Number(qualityParam.trim().slice(2)) : 1;

      return {
        locale: localePart.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter(({ locale }) => locale.length > 0)
    .sort((a, b) => b.quality - a.quality)
    .map(({ locale }) => locale);
};

const resolveLocale = (acceptLanguage: string | null): SupportedLocale => {
  const preferredLocales = getPreferredLocales(acceptLanguage);
  const supportedLocales = Object.keys(messagesLoaders) as SupportedLocale[];

  for (const preferredLocale of preferredLocales) {
    if (supportedLocales.includes(preferredLocale as SupportedLocale)) {
      return preferredLocale as SupportedLocale;
    }

    const baseLanguage = preferredLocale.split("-")[0];
    const baseLanguageMatch = supportedLocales.find(
      (supportedLocale) => supportedLocale === baseLanguage
    );

    if (baseLanguageMatch) {
      return baseLanguageMatch;
    }
  }

  return DEFAULT_LOCALE;
};

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  const locale = resolveLocale(requestHeaders.get("accept-language"));

  return {
    locale,
    messages: (await messagesLoaders[locale]()).default,
  };
});

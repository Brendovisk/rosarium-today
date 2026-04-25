import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import type { SupportedLocale } from "@/config/locales";
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from "@/config/settings";

type MessagesModule = {
  default: Record<string, unknown>;
};

const messagesLoaders: Record<SupportedLocale, () => Promise<MessagesModule>> =
  {
    en: () => import("./ui/en.json") as Promise<MessagesModule>,
    "pt-br": () => import("./ui/pt-br.json") as Promise<MessagesModule>,
    la: () => import("./ui/la.json") as Promise<MessagesModule>,
  };

const prayerMessagesLoaders: Record<
  SupportedLocale,
  () => Promise<MessagesModule>
> = {
  en: () => import("./prayers/en.json") as Promise<MessagesModule>,
  "pt-br": () => import("./prayers/pt-br.json") as Promise<MessagesModule>,
  la: () => import("./prayers/la.json") as Promise<MessagesModule>,
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const locale = parseSettingsCookie(
    cookieStore.get(SETTINGS_COOKIE_NAME)?.value
  ).uiLanguage;
  const [uiMessages, prayerMessages] = await Promise.all([
    messagesLoaders[locale](),
    prayerMessagesLoaders[locale](),
  ]);

  const uiPrayerMessages =
    typeof uiMessages.default.prayer === "object" && uiMessages.default.prayer
      ? uiMessages.default.prayer
      : {};

  return {
    locale,
    messages: {
      ...uiMessages.default,
      prayer: {
        ...uiPrayerMessages,
        ...prayerMessages.default,
      },
    },
  };
});

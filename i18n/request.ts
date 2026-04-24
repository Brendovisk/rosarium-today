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

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const locale = parseSettingsCookie(
    cookieStore.get(SETTINGS_COOKIE_NAME)?.value
  ).uiLanguage;

  return {
    locale,
    messages: (await messagesLoaders[locale]()).default,
  };
});

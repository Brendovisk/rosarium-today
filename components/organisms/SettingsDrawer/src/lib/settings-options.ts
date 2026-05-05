import { type LucideIcon, Moon, Sun } from "lucide-react";

import type { ThemePreference } from "@/config/settings";

export type ThemeOption = {
  value: ThemePreference;
  label: string;
  sub: string;
  Icon: LucideIcon;
};

type SettingsTranslator = (
  key: "dark" | "darkSub" | "light" | "lightSub"
) => string;

export function getThemeOptions(t: SettingsTranslator): ThemeOption[] {
  return [
    {
      value: "dark",
      label: t("dark"),
      sub: t("darkSub"),
      Icon: Moon,
    },
    {
      value: "light",
      label: t("light"),
      sub: t("lightSub"),
      Icon: Sun,
    },
  ];
}

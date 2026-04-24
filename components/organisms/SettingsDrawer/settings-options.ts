import { type LucideIcon, Moon, Sun } from "lucide-react";

export type ThemeOptionValue = "dark" | "light";

export type ThemeOption = {
  value: ThemeOptionValue;
  label: string;
  sub: string;
  Icon: LucideIcon;
  activeClassName: string;
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
      activeClassName:
        "dark:border-gold dark:bg-gold-soft dark:hover:border-gold",
    },
    {
      value: "light",
      label: t("light"),
      sub: t("lightSub"),
      Icon: Sun,
      activeClassName:
        "border-gold bg-gold-soft hover:border-gold dark:border-line dark:bg-transparent dark:hover:border-line-2",
    },
  ];
}

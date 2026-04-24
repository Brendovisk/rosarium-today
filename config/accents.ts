import type { ThemePreference } from "@/config/settings";

export const ACCENT_COLORS = ["gold", "wine", "moss"] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

export type AccentVars = {
  gold: string;
  dim: string;
  soft: string;
};

export const ACCENT_VARS: Record<
  AccentColor,
  Record<ThemePreference, AccentVars>
> = {
  gold: {
    dark: {
      gold: "#c6a15b",
      dim: "rgba(198,161,91,0.55)",
      soft: "rgba(198,161,91,0.16)",
    },
    light: {
      gold: "#8c6b2a",
      dim: "rgba(140, 107, 42, 0.6)",
      soft: "rgba(140, 107, 42, 0.14)",
    },
  },
  wine: {
    dark: {
      gold: "#a84c4e",
      dim: "rgba(168,76,78,0.55)",
      soft: "rgba(168,76,78,0.16)",
    },
    light: {
      gold: "#8f3739",
      dim: "rgba(143,55,57,0.6)",
      soft: "rgba(143,55,57,0.14)",
    },
  },
  moss: {
    dark: {
      gold: "#7a9d7a",
      dim: "rgba(122,157,122,0.55)",
      soft: "rgba(122,157,122,0.16)",
    },
    light: {
      gold: "#587c58",
      dim: "rgba(88,124,88,0.6)",
      soft: "rgba(88,124,88,0.14)",
    },
  },
};

export const ACCENT_OPTIONS: { value: AccentColor; swatch: string }[] = [
  { value: "gold", swatch: "#c6a15b" },
  { value: "wine", swatch: "#a84c4e" },
  { value: "moss", swatch: "#7a9d7a" },
];

export function isAccentColor(value: unknown): value is AccentColor {
  return ACCENT_COLORS.includes(value as AccentColor);
}

export function getAccentVars(
  accent: AccentColor,
  theme: ThemePreference
): AccentVars {
  return ACCENT_VARS[accent][theme];
}

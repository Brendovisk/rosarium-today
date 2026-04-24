"use client";

import { Moon, Sun } from "lucide-react";

import { useSettings } from "@/providers/SettingsProvider";

import { Button } from "../Button";

export function ThemeSwitcher() {
  const { settings, patchSettings } = useSettings();

  function toggleTheme() {
    patchSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </Button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { saveSettingsCookie } from "@/app/actions/settings";
import { TooltipProvider } from "@/components/atoms/Tooltip";
import { getAccentVars } from "@/config/accents";
import { getCanonicalPath, getLocalizedPath } from "@/config/routes";
import { type AppSettings, normalizeSettings } from "@/config/settings";

type PatchSettings = (patch: Partial<AppSettings>) => void;

type SettingsContextValue = {
  settings: AppSettings;
  patchSettings: PatchSettings;
  isPending: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applySettingsToDocument(settings: AppSettings) {
  const root = document.documentElement;
  const accentVars = getAccentVars(settings.accent, settings.theme);

  root.lang = settings.uiLanguage;
  root.classList.toggle("dark", settings.theme === "dark");
  root.classList.toggle("light", settings.theme === "light");
  root.classList.toggle("theme-dark", settings.theme === "dark");
  root.classList.toggle("theme-light", settings.theme === "light");
  root.style.setProperty("--gold", accentVars.gold);
  root.style.setProperty("--gold-dim", accentVars.dim);
  root.style.setProperty("--gold-soft", accentVars.soft);
}

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: AppSettings;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const settingsRef = useRef(initialSettings);

  useEffect(() => {
    applySettingsToDocument(settings);
  }, [settings]);

  const patchSettings = useCallback<PatchSettings>(
    (patch) => {
      const nextSettings = normalizeSettings({
        ...settingsRef.current,
        ...patch,
      });

      const localeChanged = patch.uiLanguage !== undefined;
      const prayerLangChanged = patch.prayerLanguage !== undefined;

      settingsRef.current = nextSettings;

      setSettings(nextSettings);
      applySettingsToDocument(nextSettings);

      startTransition(() => {
        void saveSettingsCookie(nextSettings).then(() => {
          if (localeChanged) {
            const canonical = getCanonicalPath(window.location.pathname);
            const newPath = getLocalizedPath(canonical, nextSettings.uiLanguage);
            router.push(newPath + window.location.search);
          } else if (prayerLangChanged) {
            router.refresh();
          }
        });
      });
    },
    [router]
  );

  const value = useMemo(
    () => ({ settings, patchSettings, isPending }),
    [settings, patchSettings, isPending]
  );

  return (
    <SettingsContext.Provider value={value}>
      <TooltipProvider>{children}</TooltipProvider>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}

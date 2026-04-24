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
import { getAccentVars } from "@/config/accents";
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
  const normalizedInitialSettings = useMemo(
    () => normalizeSettings(initialSettings),
    [initialSettings]
  );
  const [settings, setSettings] = useState(normalizedInitialSettings);
  const settingsRef = useRef(normalizedInitialSettings);

  useEffect(() => {
    applySettingsToDocument(settings);
  }, [settings]);

  const patchSettings = useCallback<PatchSettings>(
    (patch) => {
      const nextSettings = normalizeSettings({
        ...settingsRef.current,
        ...patch,
      });

      const shouldRefresh =
        patch.uiLanguage !== undefined || patch.prayerLanguage !== undefined;

      settingsRef.current = nextSettings;

      setSettings(nextSettings);
      applySettingsToDocument(nextSettings);

      startTransition(() => {
        void saveSettingsCookie(nextSettings).then(() => {
          if (shouldRefresh) {
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
      {children}
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

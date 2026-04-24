"use client";

import { useSyncExternalStore } from "react";

import { ACCENT_VARS, type AccentColor } from "@/config/accents";
import { type AppSettings, DEFAULT_SETTINGS } from "@/config/settings";

type PatchSettings = (patch: Partial<AppSettings>) => void;
type SettingsListener = () => void;
type SettingsStore = {
  getSnapshot: () => AppSettings;
  subscribe: (listener: SettingsListener) => () => void;
  patch: PatchSettings;
};

function applyAccent(accent: AccentColor) {
  const vars = ACCENT_VARS[accent];
  const root = document.documentElement;

  root.style.setProperty("--gold", vars.gold);
  root.style.setProperty("--gold-dim", vars.dim);
  root.style.setProperty("--gold-soft", vars.soft);
}

let settings: AppSettings = DEFAULT_SETTINGS;
const listeners = new Set<SettingsListener>();

const settingsStore: SettingsStore = {
  getSnapshot: () => settings,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  patch: (patch) => {
    settings = { ...settings, ...patch };

    if (patch.accent) {
      applyAccent(patch.accent);
    }

    listeners.forEach((listener) => listener());
  },
};

export function useSettings(): [AppSettings, PatchSettings] {
  const currentSettings = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getSnapshot
  );

  return [currentSettings, settingsStore.patch];
}

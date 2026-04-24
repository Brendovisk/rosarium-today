"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import type { AccentColor } from "@/config/accents";
import { ACCENT_OPTIONS } from "@/config/accents";
import type { SupportedLocale } from "@/config/locales";
import { LOCALE_OPTIONS } from "@/config/locales";
import type { ThemePreference } from "@/config/settings";
import { cn } from "@/lib/classNames";
import { useSettings } from "@/providers/SettingsProvider";

import { getThemeOptions } from "./settings-options";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SECTION_LABEL =
  "font-ui text-[0.625rem] font-bold tracking-[0.2em] uppercase text-muted mb-3.5";

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const t = useTranslations("settings");

  const { settings, patchSettings } = useSettings();

  function handleThemeChange(theme: ThemePreference) {
    patchSettings({ theme });
  }

  function handleAccentChange(accent: AccentColor) {
    patchSettings({ accent });
  }

  function handleUiLanguageChange(uiLanguage: SupportedLocale) {
    patchSettings({ uiLanguage });
  }

  function handlePrayerLanguageChange(prayerLanguage: SupportedLocale) {
    patchSettings({ prayerLanguage });
  }

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/50 z-90 transition-opacity duration-250",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[25rem] bg-ink-2 border-l border-line z-91",
          "shadow-[-1.875rem_0_5rem_-1.25rem_rgba(0,0,0,0.6)]",
          "transition-transform duration-320 ease-[cubic-bezier(.2,.7,.2,1)]",
          "p-[2rem_2.25rem] overflow-y-auto flex flex-col gap-8",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex justify-between items-center">
          <div>
            <div className="font-ui text-[0.625rem] font-bold tracking-[0.26em] uppercase text-gold">
              {t("title")}
            </div>

            <div className="font-display font-normal text-[1.875rem] mt-1">
              {t("heading")}
            </div>
          </div>

          <Button onClick={onClose} variant="outline" size="icon">
            <X size={16} />
          </Button>
        </header>

        <section>
          <div className={SECTION_LABEL}>{t("theme")}</div>

          <div className="flex gap-2.5">
            {getThemeOptions(t).map(({ value, label, sub, Icon }) => {
              const active = settings.theme === value;

              return (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    "flex-1 p-[1.125rem_0.875rem] rounded-[0.875rem] border flex flex-col gap-2.5 items-center transition-all text-bone",
                    "border-line bg-transparent hover:border-line-2",
                    active && "border-gold bg-gold-soft hover:border-gold"
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full grid place-items-center border border-line",
                      value === "light"
                        ? "bg-[#f0e6d2] text-[#8c6b2a]"
                        : "bg-[#1a1410] text-gold"
                    )}
                  >
                    <Icon size={14} />
                  </span>

                  <span className="font-display text-[0.9375rem] leading-none">
                    {label}
                  </span>

                  <span className="font-ui text-[0.625rem] tracking-[0.14em] uppercase text-muted-2">
                    {sub}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className={SECTION_LABEL}>{t("accentColor")}</div>
          <div className="flex gap-2.5">
            {ACCENT_OPTIONS.map(({ value, swatch }) => {
              const active = settings.accent === value;

              return (
                <button
                  key={value}
                  onClick={() => handleAccentChange(value)}
                  className={cn(
                    "flex-1 p-[1.125rem_0.875rem] rounded-[0.875rem] border flex flex-col gap-2.5 items-center transition-all",
                    active
                      ? "border-gold bg-gold-soft"
                      : "border-line bg-transparent hover:border-line-2"
                  )}
                >
                  <span
                    className="w-7 h-7 rounded-full shadow-[inset_0_0_0_0.0625rem_rgba(255,255,255,0.1)]"
                    style={{ background: swatch }}
                  />

                  <span className="font-ui text-[0.75rem] text-bone">
                    {t(value as "gold" | "wine" | "moss")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className={SECTION_LABEL}>{t("uiLanguage")}</div>

          <div className="flex flex-col gap-1.5">
            {LOCALE_OPTIONS.map(({ value, label }) => {
              const active = settings.uiLanguage === value;

              return (
                <button
                  key={value}
                  onClick={() => handleUiLanguageChange(value)}
                  className={cn(
                    "p-[0.875rem_1rem] rounded-[0.625rem] border flex justify-between items-center",
                    "font-display text-[1.0625rem] text-bone transition-all",
                    active
                      ? "border-gold bg-gold-soft"
                      : "border-line bg-transparent hover:border-line-2"
                  )}
                >
                  <span>{label}</span>

                  {active && (
                    <span className="text-gold text-[1.125rem]">
                      <Check />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className={SECTION_LABEL}>{t("prayerLanguage")}</div>

          <div className="flex flex-col gap-1.5">
            {LOCALE_OPTIONS.map(({ value, label }) => {
              const active = settings.prayerLanguage === value;

              return (
                <Button
                  key={value}
                  onClick={() => handlePrayerLanguageChange(value)}
                  className={cn(
                    "p-[0.875rem_1rem] rounded-[0.625rem] border flex justify-between items-center",
                    "font-display text-[1.0625rem] text-bone transition-all",
                    active
                      ? "border-gold bg-gold-soft"
                      : "border-line bg-transparent hover:border-line-2"
                  )}
                >
                  <span>{label}</span>

                  {active && (
                    <span className="text-gold text-[1.125rem]">
                      <Check />
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </section>

        <div className="mt-auto pt-6 border-t border-line font-display italic text-sm text-muted-2 text-center">
          Ad Maiorem Dei Gloriam
        </div>
      </aside>
    </>
  );
}

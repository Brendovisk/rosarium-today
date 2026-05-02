"use client";

import { Check, Keyboard, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import { Kbd } from "@/components/atoms/Kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";
import type { AccentColor } from "@/config/accents";
import { ACCENT_OPTIONS } from "@/config/accents";
import type { SupportedLocale } from "@/config/locales";
import { LOCALE_OPTIONS } from "@/config/locales";
import type { ThemePreference, VoiceGender } from "@/config/settings";
import { VOICE_GENDERS } from "@/config/settings";
import { useIsMac } from "@/hooks/use-is-mac";
import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/classNames";

import { getThemeOptions } from "./settings-options";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onShortcuts: () => void;
}

const SECTION_LABEL =
  "font-ui text-[0.625rem] font-bold tracking-[0.2em] uppercase text-muted mb-3.5";

export function SettingsDrawer({
  open,
  onClose,
  onShortcuts,
}: SettingsDrawerProps) {
  const t = useTranslations("settings");
  const tShortcuts = useTranslations("shortcuts");
  const isMac = useIsMac();
  const mod = isMac ? "⌘" : "Ctrl";

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

  function handleVoiceGenderChange(voiceGender: VoiceGender) {
    patchSettings({ voiceGender });
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
          "fixed top-0 right-0 bottom-0 w-full max-w-100 bg-ink-2 border-l border-line z-91",
          "shadow-[-1.875rem_0_5rem_-1.25rem_rgba(0,0,0,0.6)]",
          "transition-transform duration-320 ease-[cubic-bezier(.2,.7,.2,1)]",
          "flex flex-col gap-7 overflow-y-auto p-5 sm:gap-8 sm:p-[2rem_2.25rem]",
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onClose} variant="outline" size="icon">
                <X size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("close")}</TooltipContent>
          </Tooltip>
        </header>

        <section>
          <div className={SECTION_LABEL}>{t("theme")}</div>

          <div className="grid grid-cols-2 gap-2.5">
            {getThemeOptions(t).map(({ value, label, sub, Icon }) => {
              const active = settings.theme === value;

              return (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 rounded-[0.875rem] border p-[1.125rem_0.875rem] text-bone transition-all",
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
          <div className="grid grid-cols-3 gap-2.5">
            {ACCENT_OPTIONS.map(({ value, swatch }) => {
              const active = settings.accent === value;

              return (
                <button
                  key={value}
                  onClick={() => handleAccentChange(value)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 rounded-[0.875rem] border p-[1.125rem_0.875rem] transition-all",
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
          <div className={SECTION_LABEL}>{t("voice")}</div>

          <div className="grid grid-cols-2 gap-2.5">
            {VOICE_GENDERS.map((value) => {
              const active = settings.voiceGender === value;

              const label =
                value === "male"
                  ? t("voiceMale" as "voice")
                  : t("voiceFemale" as "voice");

              return (
                <button
                  key={value}
                  onClick={() => handleVoiceGenderChange(value)}
                  className={cn(
                    "rounded-[0.875rem] border p-[1.125rem_0.875rem] font-display text-[1.0625rem] text-bone transition-all",
                    active
                      ? "border-gold bg-gold-soft"
                      : "border-line bg-transparent hover:border-line-2"
                  )}
                >
                  {label}
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
                <Button
                  key={value}
                  variant="outline"
                  onClick={() => handleUiLanguageChange(value)}
                  className={cn(
                    "rounded-[0.625rem] flex justify-between",
                    "font-display",
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

        <section>
          <div className={SECTION_LABEL}>{t("prayerLanguage")}</div>

          <div className="flex flex-col gap-1.5">
            {LOCALE_OPTIONS.map(({ value, label }) => {
              const active = settings.prayerLanguage === value;

              return (
                <Button
                  key={value}
                  variant="outline"
                  onClick={() => handlePrayerLanguageChange(value)}
                  className={cn(
                    "rounded-[0.625rem] flex justify-between",
                    "font-display",
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

        <section>
          <div className={SECTION_LABEL}>{t("binauralAudio")}</div>

          <button
            onClick={() =>
              patchSettings({ binauralEnabled: !settings.binauralEnabled })
            }
            className={cn(
              "w-full flex items-center justify-between rounded-[0.875rem] border p-[1rem_1.125rem] transition-all",
              settings.binauralEnabled
                ? "border-gold bg-gold-soft"
                : "border-line bg-transparent hover:border-line-2"
            )}
          >
            <div className="text-left">
              <div className="font-display text-[0.9375rem] text-bone leading-none">
                {t("binauralAudio")}
              </div>
              <div className="font-ui text-[0.625rem] tracking-[0.14em] uppercase text-muted-2 mt-1">
                {t("binauralAudioSub")}
              </div>
            </div>
            <div
              className={cn(
                "w-10 h-6 rounded-full relative transition-colors shrink-0",
                settings.binauralEnabled ? "bg-gold" : "bg-line-2"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-ink transition-transform",
                  settings.binauralEnabled ? "translate-x-5" : "translate-x-1"
                )}
              />
            </div>
          </button>

          {settings.binauralEnabled && (
            <div className="mt-5 flex items-center gap-3 px-1">
              <span className="font-ui text-[0.625rem] tracking-[0.14em] uppercase text-muted-2 shrink-0">
                {t("binauralVolume")}
              </span>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.binauralVolume}
                onChange={(e) =>
                  patchSettings({ binauralVolume: Number(e.target.value) })
                }
                className="flex-1 accent-gold cursor-grab"
                aria-label={t("binauralVolume")}
              />

              <span className="font-ui text-xs text-muted-2 w-8 text-right shrink-0">
                {Math.round(settings.binauralVolume * 100)}%
              </span>
            </div>
          )}
        </section>

        <section>
          <div className={SECTION_LABEL}>{t("artworkBackground")}</div>

          <button
            onClick={() =>
              patchSettings({ artworkEnabled: !settings.artworkEnabled })
            }
            className={cn(
              "w-full flex items-center justify-between rounded-[0.875rem] border p-[1rem_1.125rem] transition-all",
              settings.artworkEnabled
                ? "border-gold bg-gold-soft"
                : "border-line bg-transparent hover:border-line-2"
            )}
          >
            <div className="text-left">
              <div className="font-display text-[0.9375rem] text-bone leading-none">
                {t("artworkBackground")}
              </div>
              <div className="font-ui text-[0.625rem] tracking-[0.14em] uppercase text-muted-2 mt-1">
                {t("artworkBackgroundSub")}
              </div>
            </div>
            <div
              className={cn(
                "w-10 h-6 rounded-full relative transition-colors shrink-0",
                settings.artworkEnabled ? "bg-gold" : "bg-line-2"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-ink transition-transform",
                  settings.artworkEnabled ? "translate-x-5" : "translate-x-1"
                )}
              />
            </div>
          </button>
        </section>

        <div className="mt-auto pt-6 border-t border-line flex flex-col gap-4">
          <button
            onClick={onShortcuts}
            className="flex items-center gap-2 font-ui text-xs text-muted-2 transition-colors hover:text-muted"
          >
            <Keyboard size={13} />
            {tShortcuts("link")}
            <span className="flex items-center gap-0.5">
              <Kbd>{mod}</Kbd>
              <Kbd>.</Kbd>
            </span>
          </button>

          <div className="font-display italic text-sm text-muted mt-20 border-t border-line pt-4 w-full text-center">
            Ad Maiorem Dei Gloriam
          </div>
        </div>
      </aside>
    </>
  );
}

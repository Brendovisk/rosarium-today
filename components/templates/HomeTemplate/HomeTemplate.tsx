"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Moon,
  Music,
  Music2,
  Music3,
  Play,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BeadViz } from "@/components/atoms/BeadViz";
import { Button } from "@/components/atoms/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";
import { DonateModal } from "@/components/molecules/DonateModal";
import { MysteryCarousel } from "@/components/molecules/MysteryCarousel";
import { ShortcutsModal } from "@/components/molecules/ShortcutsModal";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import type { MysteryKey } from "@/config/rosary";
import { MYSTERIES } from "@/config/rosary";
import { isMysteryKey } from "@/config/rosary";
import { useBinauralAudio } from "@/hooks/use-binaural-audio";
import { usePrayerHistory } from "@/hooks/use-prayer-history";
import { useRosaryProgress } from "@/hooks/use-rosary-progress";
import {
  ESTIMATED_ROSARY_DURATION_MINS,
  LAST_MYSTERY_KEY,
} from "@/player/rosary-steps";
import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/classNames";
import { getCurrentDate } from "@/utils/getCurrentDate";
import { isMacOS } from "@/utils/platform";

interface HomeTemplateProps {
  todaysMystery: MysteryKey;
}

export function HomeTemplate({ todaysMystery }: HomeTemplateProps) {
  const t = useTranslations("home");
  const tPrayer = useTranslations("prayer");
  const tControls = useTranslations("controls");
  const tSettings = useTranslations("settings");

  const [lastMystery, setLastMystery] = useState<MysteryKey | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem(LAST_MYSTERY_KEY);
      if (stored && isMysteryKey(stored)) setLastMystery(stored);
    });
  }, []);

  const continueMystery = lastMystery ?? todaysMystery;
  const { canGoPrev } = useRosaryProgress(continueMystery);

  const { lastPrayedDaysAgo, streak, isHydrated } = usePrayerHistory();

  const { settings, patchSettings } = useSettings();
  useBinauralAudio(settings.binauralEnabled, settings.binauralVolume);

  const [donateOpen, setDonateOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const dateStr = getCurrentDate();

  const toggleLeftMenu = useCallback(() => {
    patchSettings({ leftMenuCollapsed: !settings.leftMenuCollapsed });
  }, [patchSettings, settings.leftMenuCollapsed]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const mod = isMacOS() ? e.metaKey : e.ctrlKey;

      // open shortcuts modal
      if (mod && e.key === ".") {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      // open settings drawer
      if (mod && e.key === ",") {
        e.preventDefault();
        patchSettings({ rightMenuCollapsed: false });
        return;
      }

      // close shortcuts modal
      if (e.key === "Escape") {
        setShortcutsOpen(false);
        return;
      }

      // toggle left menu
      if (mod && e.key === "/") {
        e.preventDefault();
        toggleLeftMenu();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [patchSettings, toggleLeftMenu]);

  const mysteryDecades = useMemo(
    () =>
      MYSTERIES.reduce<Record<MysteryKey, string[]>>((acc, key) => {
        acc[key] = [0, 1, 2, 3, 4].map((i) =>
          tPrayer(
            `mysteries.${key}.decades.${i}` as `mysteries.joyful.decades.0`
          )
        );
        return acc;
      }, {} as Record<MysteryKey, string[]>),
    [tPrayer]
  );

  const mysteryNames = useMemo(
    () =>
      MYSTERIES.reduce<Record<MysteryKey, string>>((acc, key) => {
        acc[key] = t(`mysteries.${key}`);
        return acc;
      }, {} as Record<MysteryKey, string>),
    [t]
  );

  const mysteryDays = useMemo(
    () =>
      MYSTERIES.reduce<Record<MysteryKey, string>>((acc, key) => {
        acc[key] = t(`days.${key}`);
        return acc;
      }, {} as Record<MysteryKey, string>),
    [t]
  );

  function toggleTheme() {
    patchSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  }

  function toggleBinaural() {
    patchSettings({ binauralEnabled: !settings.binauralEnabled });
  }

  function openRightMenu() {
    patchSettings({ rightMenuCollapsed: false });
  }

  function closeRightMenu() {
    patchSettings({ rightMenuCollapsed: true });
  }

  return (
    <div
      className={cn(
        "min-h-screen grid grid-cols-1 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] relative z-2",
        settings.leftMenuCollapsed
          ? "lg:grid-cols-[4rem_1fr]"
          : "lg:grid-cols-[15rem_1fr]"
      )}
    >
      <div className="hidden lg:flex">
        <AppSidebar
          collapsed={settings.leftMenuCollapsed}
          onToggle={toggleLeftMenu}
          todaysMystery={todaysMystery}
        />
      </div>

      <div className="min-w-0 flex flex-col min-h-screen">
        <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-line sticky top-0 bg-ink/75 backdrop-blur-[0.875rem] z-10 shrink-0 lg:pl-10 lg:pr-4 min-h-[4.5rem] lg:min-h-[5.125rem]">
          <div className="min-w-0 flex items-center gap-3 text-muted font-ui text-xs sm:gap-4.5 sm:text-sm">
            <span className="truncate font-display font-medium text-base text-bone capitalize sm:text-[1.125rem]">
              {dateStr}
            </span>

            <span className="hidden text-muted-2 md:inline">·</span>

            <span className="hidden md:inline">{t("todaySub")}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            <Button
              variant="outline"
              size="icon"
              className="font-ui tracking-[0.04em] text-muted sm:w-auto sm:px-5"
              onClick={() => setDonateOpen(true)}
              aria-label={t("donate")}
            >
              <Heart />
              <span className="hidden sm:inline ml-2">{t("donate")}</span>
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="text-muted"
                >
                  <Sun className="hidden dark:block" size={18} />
                  <Moon className="dark:hidden" size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tControls("toggleTheme")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openRightMenu}
                  aria-label={tSettings("title")}
                  className="text-muted"
                >
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tSettings("title")}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-0 sm:px-8 sm:pb-16 lg:px-14 lg:pb-20 overflow-hidden">
          <section className="grid grid-cols-1 items-center gap-8 py-10 sm:gap-10 sm:py-12 xl:grid-cols-[1.1fr_1fr] xl:gap-18 xl:py-14">
            <div className="text-center xl:text-left">
              <div className="mb-5.5 hidden sm:inline-flex items-center justify-center gap-3 font-ui text-[0.6875rem] font-bold uppercase tracking-[0.32em] text-gold before:h-px before:w-7 before:bg-gold-dim before:content-[''] after:h-px after:w-7 after:bg-gold-dim after:content-[''] xl:justify-start">
                {t("kicker")}
              </div>

              <h1 className="m-0 mb-6 font-display text-[clamp(2.8rem,8vw,5.75rem)] font-normal leading-[0.95] tracking-[-0.01em] text-bone sm:mb-8 xl:mb-10">
                {t("welcome")}
                <br />

                <em className="italic text-gold">{t("welcome2")}</em>
              </h1>

              <p className="mx-auto mb-8 max-w-[36ch] font-body text-base leading-[1.55] text-muted sm:text-[1.1875rem] xl:mx-0">
                {t("heroSub")}
              </p>

              <div className="mb-9 flex flex-col justify-center gap-5 text-muted font-ui text-sm sm:gap-7 xl:flex-row xl:justify-start">
                <div className="flex flex-col gap-1">
                  <span className="font-ui font-medium text-[0.6875rem] tracking-[0.18em] uppercase text-muted">
                    {t("lastPrayer")}
                  </span>

                  <strong className="font-display font-medium text-[1.375rem] text-bone">
                    {!isHydrated || lastPrayedDaysAgo === null
                      ? "—"
                      : lastPrayedDaysAgo === 0
                      ? t("lastPrayerValueToday")
                      : lastPrayedDaysAgo === 1
                      ? t("lastPrayerValueYesterday")
                      : t("lastPrayerValue", { days: lastPrayedDaysAgo })}
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-ui font-medium text-[0.6875rem] tracking-[0.18em] uppercase text-muted">
                    {t("streak")}
                  </span>

                  <strong className="font-display font-medium text-[1.375rem] text-bone">
                    {isHydrated ? streak : "—"}
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-ui font-medium text-[0.6875rem] tracking-[0.18em] uppercase text-muted">
                    {t("avgDuration")}
                  </span>

                  <strong className="font-display font-medium text-[1.375rem] text-bone">
                    {t("avgDurationValue", {
                      count: ESTIMATED_ROSARY_DURATION_MINS,
                    })}
                  </strong>
                </div>
              </div>

              <div className="flex relative flex-col items-stretch justify-center gap-3 w-full xl:justify-start sm:flex-row flex-nowrap">
                <Link
                  href={`/prayer/${continueMystery}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-gold bg-gold px-7 py-4 font-ui text-[0.875rem] font-semibold tracking-[0.03em] text-ink transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_0.875rem_2.5rem_-0.875rem_rgba(198,161,91,0.6)]"
                >
                  <Play size={18} fill="currentColor" />{" "}
                  {canGoPrev ? t("continue") : t("start")}
                </Link>

                <Link
                  href={`/prayer/${todaysMystery}?silent=1`}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-line-2 bg-transparent px-7 py-4 font-ui text-[0.875rem] font-semibold tracking-[0.03em] text-bone transition-colors hover:border-gold hover:text-gold"
                >
                  <BookOpen size={18} /> {t("readSilent")}
                </Link>

                <div className="absolute -top-20 right-0 sm:relative sm:right-0 sm:top-auto w-[3.4375rem] h-[3.4375rem]">
                  <AnimatePresence>
                    {settings.binauralEnabled &&
                      (
                        [
                          { Icon: Music, delay: 0, x: 0, size: 14 },
                          { Icon: Music2, delay: 0.6, x: 14, size: 13 },
                          { Icon: Music3, delay: 1.2, x: 6, size: 15 },
                          { Icon: Music, delay: 1.8, x: 12, size: 12 },
                        ] as const
                      ).map(({ Icon, delay, x, size }, i) => (
                        <motion.span
                          key={i}
                          aria-hidden
                          className="pointer-events-none absolute left-1/2 top-0 text-gold"
                          initial={{ x, y: 0, opacity: 0, scale: 0.8 }}
                          animate={{
                            y: -60,
                            opacity: [0, 1, 0],
                            scale: [0.8, 1, 1.6],
                          }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{
                            duration: 2.4,
                            delay,
                            repeat: Infinity,
                            ease: "easeOut",
                            times: [0, 0.2, 1],
                          }}
                        >
                          <Icon size={size} />
                        </motion.span>
                      ))}
                  </AnimatePresence>

                  <Button
                    variant={settings.binauralEnabled ? "default" : "outline"}
                    size="icon"
                    onClick={toggleBinaural}
                    className="rounded-full w-full h-full"
                    aria-label="Toggle binaural audio"
                  >
                    <Music2 size={18} />
                  </Button>
                </div>
              </div>
            </div>

            <BeadViz
              mysteryName={mysteryNames[todaysMystery]}
              mysteryDay={mysteryDays[todaysMystery]}
              kicker={t("todaySuggestion")}
            />
          </section>

          <section>
            <div className="mb-7 flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <h2 className="m-0 font-display text-[clamp(2.25rem,8vw,2.625rem)] font-normal tracking-[-0.01em]">
                {t("mysteriesTitle")}{" "}
                <em className="italic text-gold">{t("mysteriesTitle2")}</em>
              </h2>

              <p className="mx-auto max-w-[42ch] font-ui text-sm text-muted md:mx-0 md:text-right">
                {t("mysteriesSub")}
              </p>
            </div>

            <MysteryCarousel
              todaysMystery={todaysMystery}
              mysteryNames={mysteryNames}
              mysteryDays={mysteryDays}
              mysteryDecades={mysteryDecades}
              todayBadge={t("todayBadge")}
              kicker={t("mysteryKicker")}
            />
          </section>

          <div className="mt-14 border-t border-line pt-7 sm:mt-20">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="font-display text-[0.875rem] italic text-muted">
                Rosarium Today · MMXXVI
              </span>

              <div className="flex items-center gap-5">
                <Link
                  href="https://github.com/Brendovisk/rosarium-today"
                  className="font-ui text-xs text-muted transition-colors hover:text-bone"
                >
                  GitHub
                </Link>

                <Link
                  href="/privacy"
                  className="font-ui text-xs text-muted transition-colors hover:text-bone"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/terms"
                  className="font-ui text-xs text-muted transition-colors hover:text-bone"
                >
                  Terms of Use
                </Link>
              </div>

              <span className="font-display text-[0.875rem] italic text-muted">
                Ad Maiorem Dei Gloriam
              </span>
            </div>
          </div>
        </div>
      </div>

      <SettingsDrawer
        open={!settings.rightMenuCollapsed}
        onClose={closeRightMenu}
        onShortcuts={() => setShortcutsOpen(true)}
      />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      <ShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

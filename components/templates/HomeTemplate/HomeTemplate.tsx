"use client";

import { BookOpen, Heart, Moon, Play, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import { BeadViz } from "@/components/atoms/BeadViz";
import { DonateModal } from "@/components/molecules/DonateModal";
import { MysteryCarousel } from "@/components/molecules/MysteryCarousel";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import type { MysteryKey } from "@/config/rosary";
import { MYSTERIES } from "@/config/rosary";
import { cn } from "@/lib/classNames";
import { getCurrentDate } from "@/utils/getCurrentDate";

interface HomeTemplateProps {
  todaysMystery: MysteryKey;
}

export function HomeTemplate({ todaysMystery }: HomeTemplateProps) {
  const t = useTranslations("home");
  const tPrayer = useTranslations("prayer");

  const { theme, setTheme } = useTheme();

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  const dateStr = getCurrentDate();

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
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div
      className={cn(
        "min-h-screen grid transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] relative z-[2]",
        leftCollapsed ? "grid-cols-[64px_1fr]" : "grid-cols-[240px_1fr]"
      )}
    >
      <AppSidebar
        collapsed={leftCollapsed}
        onToggle={() => setLeftCollapsed((c) => !c)}
      />

      <div className="min-w-0 flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between px-11 py-[22px] border-b border-line sticky top-0 bg-ink/75 backdrop-blur-[14px] z-10 shrink-0">
          <div className="flex items-center gap-[18px] text-muted font-ui text-[13px]">
            <span className="font-display font-medium text-[18px] text-bone capitalize">
              {dateStr}
            </span>

            <span className="text-muted-2">·</span>

            <span>{t("todaySub")}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              className="pl-2 pr-3.5 py-2 rounded-full font-ui text-[12px] font-medium tracking-[0.04em] text-gold border border-gold-dim inline-flex items-center gap-2 transition-colors hover:text-bone hover:border-line"
              onClick={() => setDonateOpen(true)}
            >
              <span className="w-6 h-6 rounded-full bg-gold-soft border border-gold-dim grid place-items-center shrink-0">
                <Heart size={12} />
              </span>
              {t("donate")}
            </button>

            <button
              className="w-9 h-9 grid place-items-center rounded-full border border-line/50 bg-white/3 text-muted hover:text-bone hover:border-gold-dim hover:bg-white/6 transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Sun className="hidden dark:block" size={18} />

              <Moon className="dark:hidden" size={18} />
            </button>

            <button
              className="w-9 h-9 grid place-items-center rounded-full border border-line/50 bg-white/3 text-muted hover:text-bone hover:border-gold-dim hover:bg-white/6 transition-colors"
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-14 pb-20 max-w-[1280px] mx-auto w-full pt-0">
          {/* Hero */}
          <section className="grid grid-cols-[1.1fr_1fr] gap-[72px] items-center py-9 pb-14">
            <div>
              <div className="font-ui text-[11px] font-bold tracking-[0.32em] uppercase text-gold mb-[22px] inline-flex items-center gap-3 before:content-[''] before:w-7 before:h-px before:bg-gold-dim after:content-[''] after:w-7 after:h-px after:bg-gold-dim">
                {t("kicker")}
              </div>

              <h1 className="font-display font-normal text-[92px] leading-[0.95] tracking-[-0.01em] text-bone m-0 mb-4">
                {t("welcome")}
                <br />

                <em className="italic text-gold">{t("welcome2")}</em>
              </h1>

              <p className="font-body text-[19px] leading-[1.55] text-muted max-w-[36ch] m-0 mb-8">
                {t("heroSub")}
              </p>

              <div className="flex gap-7 mb-9 text-muted font-ui text-[13px]">
                <div className="flex flex-col gap-1">
                  <span className="font-ui font-bold text-[11px] tracking-[0.18em] uppercase text-muted">
                    {t("lastPrayer")}
                  </span>

                  <strong className="font-display font-medium text-[22px] text-bone">
                    {t("lastPrayerValue", { days: 2 })}
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-ui font-bold text-[11px] tracking-[0.18em] uppercase text-muted">
                    {t("streak")}
                  </span>

                  <strong className="font-display font-medium text-[22px] text-bone">
                    14
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-ui font-bold text-[11px] tracking-[0.18em] uppercase text-muted">
                    {t("avgDuration")}
                  </span>

                  <strong className="font-display font-medium text-[22px] text-bone">
                    {t("avgDurationValue", { count: 22 })}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-[18px]">
                <Link
                  href={`/prayer/${todaysMystery}`}
                  className="px-7 py-4 rounded-full font-ui text-[14px] font-semibold tracking-[0.03em] inline-flex items-center gap-3 border border-gold bg-gold text-ink transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_14px_40px_-14px_rgba(198,161,91,0.6)]"
                >
                  <Play size={18} fill="currentColor" /> {t("start")}
                </Link>

                <Link
                  href={`/prayer/${todaysMystery}?silent=1`}
                  className="px-7 py-4 rounded-full font-ui text-[14px] font-semibold tracking-[0.03em] inline-flex items-center gap-3 border border-line-2 bg-transparent text-bone transition-colors hover:border-gold hover:text-gold"
                >
                  <BookOpen size={18} /> {t("readSilent")}
                </Link>
              </div>
            </div>

            <BeadViz
              mysteryName={mysteryNames[todaysMystery]}
              mysteryDay={mysteryDays[todaysMystery]}
              kicker={t("todaySuggestion")}
            />
          </section>

          {/* Mystery carousel */}
          <section>
            <div className="flex items-end justify-between mb-7">
              <h2 className="font-display font-normal text-[42px] m-0 tracking-[-0.01em]">
                {t("mysteriesTitle")}{" "}
                <em className="italic text-gold">{t("mysteriesTitle2")}</em>
              </h2>

              <p className="font-ui text-[13px] text-muted max-w-[42ch] text-right">
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

          <div className="mt-20 pt-7 border-t border-line flex items-center justify-between text-muted-2 font-display italic text-[14px]">
            <span>Rosarium Today · MMXXVI</span>
            <span>Ad Maiorem Dei Gloriam</span>
          </div>
        </div>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

"use client";

import { BookOpen, Heart, Moon, Play, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { BeadViz } from "@/components/atoms/BeadViz";
import { Button } from "@/components/atoms/Button";
import { DonateModal } from "@/components/molecules/DonateModal";
import { MysteryCarousel } from "@/components/molecules/MysteryCarousel";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import type { MysteryKey } from "@/config/rosary";
import { MYSTERIES } from "@/config/rosary";
import { cn } from "@/lib/classNames";
import { useSettings } from "@/providers/SettingsProvider";
import { getCurrentDate } from "@/utils/getCurrentDate";

interface HomeTemplateProps {
  todaysMystery: MysteryKey;
}

export function HomeTemplate({ todaysMystery }: HomeTemplateProps) {
  const t = useTranslations("home");
  const tPrayer = useTranslations("prayer");

  const { settings, patchSettings } = useSettings();

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
    patchSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  }

  function toggleLeftMenu() {
    patchSettings({ leftMenuCollapsed: !settings.leftMenuCollapsed });
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
        "min-h-screen grid transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] relative z-2",
        settings.leftMenuCollapsed
          ? "grid-cols-[4rem_1fr]"
          : "grid-cols-[15rem_1fr]"
      )}
    >
      <AppSidebar
        collapsed={settings.leftMenuCollapsed}
        onToggle={toggleLeftMenu}
      />

      <div className="min-w-0 flex flex-col min-h-screen">
        <div className="flex items-center justify-between px-11 py-5.5 border-b border-line sticky top-0 bg-ink/75 backdrop-blur-[0.875rem] z-10 shrink-0">
          <div className="flex items-center gap-4.5 text-muted font-ui text-sm">
            <span className="font-display font-medium text-[1.125rem] text-bone capitalize">
              {dateStr}
            </span>

            <span className="text-muted-2">·</span>

            <span>{t("todaySub")}</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="tracking-[0.04em] font-ui text-muted"
              onClick={() => setDonateOpen(true)}
            >
              <Heart />
              {t("donate")}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-muted"
            >
              <Sun className="hidden dark:block" size={18} />

              <Moon className="dark:hidden" size={18} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={openRightMenu}
              aria-label="Settings"
              className="text-muted"
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>

        <div className="px-14 pb-20 max-w-7xl mx-auto w-full pt-0">
          <section className="grid grid-cols-[1.1fr_1fr] gap-18 items-center py-14">
            <div>
              <div className="font-ui text-[0.6875rem] font-bold tracking-[0.32em] uppercase text-gold mb-5.5 inline-flex items-center gap-3 before:content-[''] before:w-7 before:h-px before:bg-gold-dim after:content-[''] after:w-7 after:h-px after:bg-gold-dim">
                {t("kicker")}
              </div>

              <h1 className="font-display font-normal text-[5.75rem] leading-[0.95] tracking-[-0.01em] text-bone m-0 mb-10">
                {t("welcome")}
                <br />

                <em className="italic text-gold">{t("welcome2")}</em>
              </h1>

              <p className="font-body text-[1.1875rem] leading-[1.55] text-muted max-w-[36ch] m-0 mb-8">
                {t("heroSub")}
              </p>

              <div className="flex gap-7 mb-9 text-muted font-ui text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-ui font-medium text-[0.6875rem] tracking-[0.18em] uppercase text-muted">
                    {t("lastPrayer")}
                  </span>

                  <strong className="font-display font-medium text-[1.375rem] text-bone">
                    {t("lastPrayerValue", { days: 2 })}
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-ui font-medium text-[0.6875rem] tracking-[0.18em] uppercase text-muted">
                    {t("streak")}
                  </span>

                  <strong className="font-display font-medium text-[1.375rem] text-bone">
                    14
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-ui font-medium text-[0.6875rem] tracking-[0.18em] uppercase text-muted">
                    {t("avgDuration")}
                  </span>

                  <strong className="font-display font-medium text-[1.375rem] text-bone">
                    {t("avgDurationValue", { count: 22 })}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-4.5">
                <Link
                  href={`/prayer/${todaysMystery}`}
                  className="px-7 py-4 rounded-full font-ui text-[0.875rem] font-semibold tracking-[0.03em] inline-flex items-center gap-3 border border-gold bg-gold text-ink transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_0.875rem_2.5rem_-0.875rem_rgba(198,161,91,0.6)]"
                >
                  <Play size={18} fill="currentColor" /> {t("start")}
                </Link>

                <Link
                  href={`/prayer/${todaysMystery}?silent=1`}
                  className="px-7 py-4 rounded-full font-ui text-[0.875rem] font-semibold tracking-[0.03em] inline-flex items-center gap-3 border border-line-2 bg-transparent text-bone transition-colors hover:border-gold hover:text-gold"
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

          <section>
            <div className="flex items-end justify-between mb-7">
              <h2 className="font-display font-normal text-[2.625rem] m-0 tracking-[-0.01em]">
                {t("mysteriesTitle")}{" "}
                <em className="italic text-gold">{t("mysteriesTitle2")}</em>
              </h2>

              <p className="font-ui text-sm text-muted max-w-[42ch] text-right">
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

          <div className="mt-20 pt-7 border-t border-line flex items-center justify-between text-muted font-display italic text-[0.875rem]">
            <span>Rosarium Today · MMXXVI</span>
            <span>Ad Maiorem Dei Gloriam</span>
          </div>
        </div>
      </div>

      <SettingsDrawer
        open={!settings.rightMenuCollapsed}
        onClose={closeRightMenu}
      />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

"use client";

import { useRef } from "react";

import type { MysteryKey } from "@/config/rosary";
import { MYSTERIES } from "@/config/rosary";
import { getProgressStorageKey } from "@/config/rosary";
import { getLocalizedPrayerPath } from "@/config/routes";
import { useSettings } from "@/providers/SettingsProvider";

import { MysteryCard } from "../MysteryCard";

type MysteryCarouselProps = {
  todaysMystery: MysteryKey;
  mysteryNames: Record<MysteryKey, string>;
  mysteryDays: Record<MysteryKey, string>;
  mysteryDecades: Record<MysteryKey, string[]>;
  todayBadge: string;
  kicker: string;
};

export function MysteryCarousel({
  todaysMystery,
  mysteryNames,
  mysteryDays,
  mysteryDecades,
  todayBadge,
  kicker,
}: MysteryCarouselProps) {
  const { settings } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearProgress = (key: MysteryKey) => {
    localStorage.removeItem(getProgressStorageKey(key));
  };

  const cards = MYSTERIES.map((key) => (
    <MysteryCard
      key={key}
      mysteryKey={key}
      name={mysteryNames[key]}
      days={mysteryDays[key]}
      meditations={mysteryDecades[key]}
      isToday={key === todaysMystery}
      href={getLocalizedPrayerPath(key, settings.uiLanguage)}
      todayBadge={todayBadge}
      kicker={kicker}
      onClick={() => clearProgress(key)}
    />
  ));

  return (
    <>
      <div className="hidden xl:grid grid-cols-4 gap-4.5 2xl:gap-6">
        {cards}
      </div>

      <div className="xl:hidden relative before:pointer-events-none before:absolute before:-inset-y-4 before:-left-14 xl:before:-left-6 xl:after:-right-6 before:z-10 before:w-12 before:bg-linear-to-r before:from-background before:to-transparent after:pointer-events-none after:absolute after:-inset-y-4 after:-right-14 after:z-10 after:w-12 after:bg-linear-to-l after:from-background after:to-transparent sm:before:w-16 sm:after:w-16">
        <div
          ref={scrollRef}
          className="flex gap-4.5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8  max-sm:gap-0 py-4"
        >
          {MYSTERIES.map((key, i) => (
            <div
              key={key}
              className="shrink-0 snap-start w-70 md:w-[calc(33.333%-12px)] max-sm:w-full max-sm:pr-4"
            >
              {cards[i]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

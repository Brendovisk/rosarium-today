"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { MysteryKey } from "@/config/rosary";
import { MYSTERIES } from "@/config/rosary";
import { cn } from "@/lib/classNames";

import { MysteryCard } from "../MysteryCard";

interface MysteryCarouselProps {
  todaysMystery: MysteryKey;
  mysteryNames: Record<MysteryKey, string>;
  mysteryDays: Record<MysteryKey, string>;
  mysteryDecades: Record<MysteryKey, string[]>;
  todayBadge: string;
  kicker: string;
}

export function MysteryCarousel({
  todaysMystery,
  mysteryNames,
  mysteryDays,
  mysteryDecades,
  todayBadge,
  kicker,
}: MysteryCarouselProps) {
  const { width } = useWindowSize();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  const cards = MYSTERIES.map((key) => (
    <MysteryCard
      key={key}
      mysteryKey={key}
      name={mysteryNames[key]}
      days={mysteryDays[key]}
      meditations={mysteryDecades[key]}
      isToday={key === todaysMystery}
      href={`/prayer/${key}`}
      todayBadge={todayBadge}
      kicker={kicker}
    />
  ));

  if (width != null && width >= 1280) {
    return <div className="grid grid-cols-4 gap-4.5">{cards}</div>;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4.5">
          {MYSTERIES.map((key) => (
            <div key={key} className="flex-[0_0_17.5rem] min-w-0">
              <MysteryCard
                mysteryKey={key}
                name={mysteryNames[key]}
                days={mysteryDays[key]}
                meditations={mysteryDecades[key]}
                isToday={key === todaysMystery}
                href={`/prayer/${key}`}
                todayBadge={todayBadge}
                kicker={kicker}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
          "w-9 h-9 rounded-full border border-line bg-ink-2 text-muted",
          "grid place-items-center transition-colors hover:text-bone hover:border-gold-dim"
        )}
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
          "w-9 h-9 rounded-full border border-line bg-ink-2 text-muted",
          "grid place-items-center transition-colors hover:text-bone hover:border-gold-dim"
        )}
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

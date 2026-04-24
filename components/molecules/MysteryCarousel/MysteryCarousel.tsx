"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MysteryCard } from "@/components/molecules/MysteryCard";
import { cn } from "@/lib/utils/cn";
import { useScreenSize } from "@/lib/hooks/useScreenSize";
import { MYSTERIES } from "@/lib/rosary";
import type { MysteryKey } from "@/lib/rosary";

interface MysteryCarouselProps {
  locale: string;
  todaysMystery: MysteryKey;
  mysteryNames: Record<MysteryKey, string>;
  mysteryDays: Record<MysteryKey, string>;
  mysteryDecades: Record<MysteryKey, string[]>;
  todayBadge: string;
  kicker: string;
}

const cards = (
  locale: string,
  todaysMystery: MysteryKey,
  mysteryNames: Record<MysteryKey, string>,
  mysteryDays: Record<MysteryKey, string>,
  mysteryDecades: Record<MysteryKey, string[]>,
  todayBadge: string,
  kicker: string
) =>
  MYSTERIES.map((key) => (
    <MysteryCard
      key={key}
      mysteryKey={key}
      name={mysteryNames[key]}
      days={mysteryDays[key]}
      meditations={mysteryDecades[key]}
      isToday={key === todaysMystery}
      href={`/${locale}/prayer/${key}`}
      todayBadge={todayBadge}
      kicker={kicker}
    />
  ));

export function MysteryCarousel({
  locale,
  todaysMystery,
  mysteryNames,
  mysteryDays,
  mysteryDecades,
  todayBadge,
  kicker,
}: MysteryCarouselProps) {
  const { isAbove } = useScreenSize();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  if (isAbove(1280)) {
    return (
      <div className="grid grid-cols-4 gap-[18px]">
        {cards(
          locale,
          todaysMystery,
          mysteryNames,
          mysteryDays,
          mysteryDecades,
          todayBadge,
          kicker
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-[18px]">
          {MYSTERIES.map((key) => (
            <div key={key} className="flex-[0_0_280px] min-w-0">
              <MysteryCard
                mysteryKey={key}
                name={mysteryNames[key]}
                days={mysteryDays[key]}
                meditations={mysteryDecades[key]}
                isToday={key === todaysMystery}
                href={`/${locale}/prayer/${key}`}
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

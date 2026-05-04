"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import type { MysteryKey } from "@/config/rosary";
import { MYSTERIES } from "@/config/rosary";
import { getProgressStorageKey } from "@/player/rosary-steps";

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
  const shouldSnapFullCards = width == null || width <= 640;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: false,
    dragFree: !shouldSnapFullCards,
  });

  function clearProgress(key: MysteryKey) {
    localStorage.removeItem(getProgressStorageKey(key));
  }

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
      onClick={() => clearProgress(key)}
    />
  ));

  if (width != null && width >= 1280) {
    return <div className="grid grid-cols-4 gap-4.5 2xl:gap-6">{cards}</div>;
  }

  return (
    <div className="relative before:pointer-events-none before:absolute before:-inset-y-4 before:-left-6 before:z-10 before:w-12 before:bg-linear-to-r before:from-background before:to-transparent after:pointer-events-none after:absolute after:-inset-y-4 after:-right-6 after:z-10 after:w-12 after:bg-linear-to-l after:from-background after:to-transparent sm:before:w-16 sm:after:w-16">
      <div className="px-8" ref={emblaRef}>
        <div className="flex gap-4.5 max-[640px]:gap-0">
          {cards.map((card, i) => (
            <div
              key={MYSTERIES[i]}
              className="min-w-0 flex-[0_0_17.5rem] max-[640px]:flex-[0_0_100%] max-[640px]:pr-4"
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 mt-4 flex justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous mystery"
        >
          <ChevronLeft size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next mystery"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

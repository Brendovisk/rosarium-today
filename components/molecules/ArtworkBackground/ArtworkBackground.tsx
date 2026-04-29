"use client";

import type { MysteryKey } from "@/config/rosary";
import { MYSTERY_ARTWORKS } from "@/config/rosary";
import { cn } from "@/utils/classNames";

interface ArtworkBackgroundProps {
  mysteryKey: MysteryKey;
  decadeIndex: number;
  visible: boolean;
}

export function ArtworkBackground({
  mysteryKey,
  decadeIndex,
  visible,
}: ArtworkBackgroundProps) {
  const artworks = MYSTERY_ARTWORKS[mysteryKey];
  if (!artworks.length) return null;

  const src = artworks[Math.max(0, decadeIndex) % artworks.length];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
    >
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-black/70">
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

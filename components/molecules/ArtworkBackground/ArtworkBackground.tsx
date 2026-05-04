"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { Artwork } from "@/config/rosary";
import { cn } from "@/utils/classNames";

interface ArtworkBackgroundProps {
  artwork: Artwork | null;
  visible: boolean;
  isMysteryAnnouncement: boolean;
}

export function ArtworkBackground({
  artwork,
  visible,
  isMysteryAnnouncement,
}: ArtworkBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
    >
      <AnimatePresence>
        {artwork && (
          <motion.div
            key={artwork.src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <motion.img
              src={artwork.src}
              alt={artwork.alt}
              width={artwork.width}
              height={artwork.height}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: artwork.position }}
              initial={{ scale: 1 }}
              animate={{ scale: 1.07 }}
              transition={{ duration: 40, ease: "linear" }}
            />
            <div
              className={cn(
                "absolute inset-0 duration-1000 bg-(--line)/70",
                isMysteryAnnouncement && "bg-(--line)/40"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

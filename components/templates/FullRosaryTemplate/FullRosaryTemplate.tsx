"use client";

import { useCallback, useEffect, useState } from "react";

import { PrayerTemplate } from "@/components/templates/PrayerTemplate";
import type { MysteryKey } from "@/config/rosary";
import { FULL_ROSARY_INDEX_KEY, FULL_ROSARY_ORDER } from "@/config/rosary";

type FullRosaryTemplateProps = {
  todaysMystery: MysteryKey;
};

export function FullRosaryTemplate({ todaysMystery }: FullRosaryTemplateProps) {
  const [mysteryIndex, setMysteryIndex] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem(FULL_ROSARY_INDEX_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (
          Number.isFinite(parsed) &&
          parsed >= 0 &&
          parsed < FULL_ROSARY_ORDER.length
        ) {
          setMysteryIndex(parsed);
        }
      }
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(FULL_ROSARY_INDEX_KEY, String(mysteryIndex));
  }, [mysteryIndex, hasHydrated]);

  const handleComplete = useCallback(() => {
    localStorage.removeItem(FULL_ROSARY_INDEX_KEY);
  }, []);

  if (!hasHydrated) return null;

  const mysteryKey = FULL_ROSARY_ORDER[mysteryIndex];
  const hasNext = mysteryIndex < FULL_ROSARY_ORDER.length - 1;

  return (
    <PrayerTemplate
      key={mysteryKey}
      mysteryKey={mysteryKey}
      todaysMystery={todaysMystery}
      fullRosary={true}
      onFullRosaryAdvance={hasNext ? () => setMysteryIndex((i) => i + 1) : undefined}
      onFullRosaryComplete={handleComplete}
    />
  );
}

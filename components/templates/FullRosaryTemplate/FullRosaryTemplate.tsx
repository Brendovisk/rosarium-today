"use client";

import { useState } from "react";

import { PrayerTemplate } from "@/components/templates/PrayerTemplate";
import { FULL_ROSARY_ORDER } from "@/config/rosary";
import type { MysteryKey } from "@/config/rosary";

type FullRosaryTemplateProps = {
  todaysMystery: MysteryKey;
};

export function FullRosaryTemplate({ todaysMystery }: FullRosaryTemplateProps) {
  const [mysteryIndex, setMysteryIndex] = useState(0);
  const mysteryKey = FULL_ROSARY_ORDER[mysteryIndex];

  const hasNext = mysteryIndex < FULL_ROSARY_ORDER.length - 1;

  return (
    <PrayerTemplate
      key={mysteryKey}
      mysteryKey={mysteryKey}
      todaysMystery={todaysMystery}
      fullRosary={true}
      onFullRosaryAdvance={hasNext ? () => setMysteryIndex((i) => i + 1) : undefined}
    />
  );
}

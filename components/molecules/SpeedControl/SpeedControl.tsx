"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import { PLAYBACK_RATES, type PlaybackRate } from "@/config/settings";
import { cn } from "@/utils/classNames";

type SpeedControlProps = {
  rate: PlaybackRate;
  onChange: (rate: PlaybackRate) => void;
};

const MOBILE_PLAYBACK_CYCLE: PlaybackRate[] = [1, 1.25, 1.5, 0.75];

function nextMobilePlaybackRate(current: PlaybackRate): PlaybackRate {
  const index = MOBILE_PLAYBACK_CYCLE.indexOf(current);

  if (index === -1) {
    return 1;
  }

  return MOBILE_PLAYBACK_CYCLE[(index + 1) % MOBILE_PLAYBACK_CYCLE.length];
}

function formatRateLabel(rate: PlaybackRate): string {
  return `${rate}x`;
}

export function SpeedControl({ rate, onChange }: SpeedControlProps) {
  const t = useTranslations("controls");

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => onChange(nextMobilePlaybackRate(rate))}
      aria-label={t("playbackSpeedCycle", { rate: String(rate) })}
      className="font-ui text-[0.625rem] font-semibold tabular-nums tracking-tight text-muted"
    >
      {formatRateLabel(rate)}
    </Button>
  );
}

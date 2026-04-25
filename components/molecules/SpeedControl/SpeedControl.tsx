"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import { PLAYBACK_RATES, type PlaybackRate } from "@/config/settings";
import { cn } from "@/lib/classNames";

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

  return MOBILE_PLAYBACK_CYCLE[
    (index + 1) % MOBILE_PLAYBACK_CYCLE.length
  ];
}

function formatRateLabel(rate: PlaybackRate): string {
  return `${rate}x`;
}

function SpeedControlDesktop({ rate, onChange }: SpeedControlProps) {
  return (
    <div className="flex gap-1 rounded-full border border-line p-1 font-ui text-[0.6875rem] font-semibold">
      {PLAYBACK_RATES.map((playbackRate) => (
        <button
          key={playbackRate}
          onClick={() => onChange(playbackRate)}
          className={cn(
            "min-w-8 rounded-full px-2 py-1.5 transition-colors",
            rate === playbackRate
              ? "bg-gold text-ink"
              : "text-muted hover:text-bone"
          )}
        >
          {playbackRate}x
        </button>
      ))}
    </div>
  );
}

function SpeedControlMobile({ rate, onChange }: SpeedControlProps) {
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

export function SpeedControl(props: SpeedControlProps) {
  return (
    <>
      <div className="hidden sm:block">
        <SpeedControlDesktop {...props} />
      </div>

      <div className="sm:hidden">
        <SpeedControlMobile {...props} />
      </div>
    </>
  );
}

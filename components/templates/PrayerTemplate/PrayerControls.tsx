import { ChevronLeft, ChevronRight, Pause, Play, Repeat } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/atoms/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";
import { ReflectionButton } from "@/components/molecules/ReflectionButton";
import { SpeedControl } from "@/components/molecules/SpeedControl";
import type { PlaybackRate } from "@/config/settings";
import { cn } from "@/utils/classNames";

interface PrayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  isSilent: boolean;
  isMysteryAnnouncement: boolean;
  artworkEnabled: boolean;
  autoPlay: boolean;
  playbackRate: PlaybackRate;
  reflectionProgress: number;
  reflectionPaused: boolean;
  onToggleAutoPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onToggleReflectionPause: () => void;
  onRateChange: (rate: PlaybackRate) => void;
}

export function PrayerControls({
  isPlaying,
  isLoading,
  canGoPrev,
  isSilent,
  isMysteryAnnouncement,
  artworkEnabled,
  autoPlay,
  playbackRate,
  reflectionProgress,
  reflectionPaused,
  onToggleAutoPlay,
  onPrev,
  onNext,
  onPlayPause,
  onToggleReflectionPause,
  onRateChange,
}: PrayerControlsProps) {
  const tControls = useTranslations("controls");

  return (
    <div
      className={cn(
        "px-5 py-4",
        artworkEnabled ? "" : "border-t border-line bg-ink/90 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
        {!isSilent && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={autoPlay ? "default" : "outline"}
                size="icon"
                onClick={onToggleAutoPlay}
                aria-label="Auto play"
              >
                <Repeat size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tControls("autoplay")}</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
              disabled={!canGoPrev}
              suppressHydrationWarning
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tControls("previous")}</TooltipContent>
        </Tooltip>

        {!isSilent &&
          (isMysteryAnnouncement && autoPlay ? (
            <ReflectionButton
              progress={reflectionProgress}
              paused={reflectionPaused}
              onToggle={onToggleReflectionPause}
            />
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onPlayPause}
                  disabled={isLoading || isMysteryAnnouncement}
                  aria-label={isPlaying ? tControls("pause") : tControls("play")}
                  className="size-14"
                >
                  {isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={22} fill="currentColor" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPlaying ? tControls("pause") : tControls("play")}
              </TooltipContent>
            </Tooltip>
          ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onNext} aria-label="Next">
              <ChevronRight size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tControls("next")}</TooltipContent>
        </Tooltip>

        {!isSilent && (
          <div className="block">
            <SpeedControl rate={playbackRate} onChange={onRateChange} />
          </div>
        )}
      </div>
    </div>
  );
}

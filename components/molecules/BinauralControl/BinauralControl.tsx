"use client";

import { Waves } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";

type BinauralControlProps = {
  enabled: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
};

export function BinauralControl({
  enabled,
  volume,
  onToggle,
  onVolumeChange,
}: BinauralControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={enabled ? "default" : "outline"}
            size="icon"
            onClick={onToggle}
            aria-label={
              enabled ? "Disable binaural audio" : "Enable binaural audio"
            }
          >
            <Waves size={16} />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Binaural audio</TooltipContent>
      </Tooltip>

      {enabled && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-20 accent-gold"
          aria-label="Binaural volume"
        />
      )}
    </div>
  );
}

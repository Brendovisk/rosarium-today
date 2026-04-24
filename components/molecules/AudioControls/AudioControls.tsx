'use client'

import { PlayButton } from '@/components/atoms/PlayButton'
import { SpeedControl } from '@/components/molecules/SpeedControl'
import { formatTime } from '@/lib/utils/time'
import type { PlaybackRate } from '@/lib/constants/playback'

interface AudioControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: PlaybackRate
  isDisabled?: boolean
  onPlayPause: () => void
  onScrub: (time: number) => void
  onSpeedChange: (rate: PlaybackRate) => void
  prayerName: string
  stepLabel: string
}

export function AudioControls({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  isDisabled,
  onPlayPause,
  onScrub,
  onSpeedChange,
  prayerName,
  stepLabel,
}: AudioControlsProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-6 px-6 py-4">
      <div className="w-44 shrink-0 min-w-0">
        <p className="truncate text-sm font-medium text-bone font-display">
          {prayerName}
        </p>
        <p className="mt-0.5 truncate text-[10px] tracking-[0.15em] uppercase text-muted-2">
          {stepLabel}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center gap-3">
        <PlayButton isPlaying={isPlaying} onToggle={onPlayPause} disabled={isDisabled} size="md" />

        <div className="flex w-full max-w-lg items-center gap-3">
          <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-muted-2">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.05}
              value={currentTime}
              disabled={isDisabled}
              onChange={(e) => onScrub(parseFloat(e.target.value))}
              className="h-[3px] w-full"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 my-auto h-[3px] rounded-full bg-gold/70 transition-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-9 shrink-0 text-[11px] tabular-nums text-muted-2">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="w-44 shrink-0 flex justify-end">
        <SpeedControl rate={playbackRate} onChange={onSpeedChange} />
      </div>
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils/cn'
import { PLAYBACK_RATES } from '@/lib/constants/playback'
import type { PlaybackRate } from '@/lib/constants/playback'

interface SpeedControlProps {
  rate: PlaybackRate
  onChange: (rate: PlaybackRate) => void
}

export function SpeedControl({ rate, onChange }: SpeedControlProps) {
  return (
    <div className="flex items-center gap-1">
      {PLAYBACK_RATES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            'rounded px-2 py-1 text-[10px] font-medium tracking-wide transition-all duration-200',
            r === rate
              ? 'bg-gold-soft text-gold ring-1 ring-gold-dim'
              : 'text-muted-2 hover:text-muted hover:bg-white/5',
          )}
        >
          {r}×
        </button>
      ))}
    </div>
  )
}

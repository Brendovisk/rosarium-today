import { cn } from '@/lib/utils/cn'
import type { PrayerKey } from '@/lib/prayers'

type BeadState = 'completed' | 'active' | 'upcoming'

interface BeadDotProps {
  state: BeadState
  prayerKey?: PrayerKey
  size?: 'sm' | 'md'
}

const LARGE_BEAD_PRAYERS: ReadonlySet<PrayerKey> = new Set([
  'pater-noster',
  'signum-crucis',
  'symbolum-apostolorum',
  'salve-regina',
  'intercessio-mariae',
])

export function BeadDot({ state, prayerKey, size = 'sm' }: BeadDotProps) {
  const isLarge = size === 'md' || (prayerKey !== undefined && LARGE_BEAD_PRAYERS.has(prayerKey))

  return (
    <span
      className={cn(
        'rounded-full shrink-0 transition-all duration-500',
        isLarge ? 'size-2.5' : 'size-1.5',
        state === 'completed' && 'bg-gold opacity-80',
        state === 'active' && 'bg-gold shadow-[0_0_6px_rgba(198,161,91,0.8)] scale-125',
        state === 'upcoming' && 'bg-line-2',
      )}
    />
  )
}

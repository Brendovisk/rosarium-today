import { Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PlayButtonProps {
  isPlaying: boolean
  onToggle: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'size-8',
  md: 'size-11',
  lg: 'size-14',
} as const

const ICON_SIZES = {
  sm: 14,
  md: 18,
  lg: 22,
} as const

export function PlayButton({ isPlaying, onToggle, disabled, size = 'md', className }: PlayButtonProps) {
  const iconSize = ICON_SIZES[size]
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className={cn(
        SIZE_CLASSES[size],
        'flex shrink-0 items-center justify-center rounded-full',
        'bg-gold text-ink',
        'shadow-[0_0_20px_rgba(198,161,91,0.35)]',
        'transition-all duration-300',
        'hover:shadow-[0_0_30px_rgba(198,161,91,0.55)] hover:scale-105',
        'active:scale-95',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        className,
      )}
    >
      {isPlaying ? <Pause size={iconSize} fill="currentColor" /> : <Play size={iconSize} fill="currentColor" />}
    </button>
  )
}

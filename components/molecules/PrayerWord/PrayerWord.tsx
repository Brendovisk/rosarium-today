import { cn } from '@/lib/utils/cn'

type WordState = 'active' | 'past' | 'upcoming'

interface PrayerWordProps {
  word: string
  state: WordState
  onClick: () => void
  wordRef?: (el: HTMLButtonElement | null) => void
}

export function PrayerWord({ word, state, onClick, wordRef }: PrayerWordProps) {
  return (
    <button
      ref={wordRef}
      onClick={onClick}
      className={cn(
        'mr-[0.3em] inline cursor-pointer transition-all duration-300 hover:text-muted',
        state === 'active' && 'text-gold animate-word-glow',
        state === 'past' && 'text-bone',
        state === 'upcoming' && 'text-muted-2',
      )}
    >
      {word.trim()}
    </button>
  )
}

import { cn } from '@/lib/utils/cn'

interface MysteryListProps {
  mysteryName: string
  decades: readonly string[]
  currentDecadeIndex: number
  onDecadeClick?: (index: number) => void
}

export function MysteryList({ mysteryName, decades, currentDecadeIndex, onDecadeClick }: MysteryListProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-caps text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-2">
        {mysteryName}
      </h3>
      <ol className="flex flex-col gap-1.5">
        {decades.map((name, index) => {
          const isActive = index === currentDecadeIndex
          const isCompleted = index < currentDecadeIndex
          return (
            <li key={index}>
              <button
                onClick={() => onDecadeClick?.(index)}
                disabled={!onDecadeClick}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all duration-300 disabled:cursor-default',
                  isActive ? 'bg-gold-soft ring-1 ring-gold-dim' : 'hover:bg-white/[0.03]',
                )}
              >
                <span className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition-all duration-300',
                  isActive ? 'bg-gold text-ink shadow-[0_0_8px_rgba(198,161,91,0.5)]'
                    : isCompleted ? 'bg-gold-soft text-gold'
                    : 'bg-ink-2 text-line-2',
                )}>
                  {index + 1}
                </span>
                <span className={cn(
                  'text-xs leading-snug transition-colors duration-300',
                  isActive ? 'text-bone font-medium' : isCompleted ? 'text-muted' : 'text-muted-2',
                )}>
                  {name}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

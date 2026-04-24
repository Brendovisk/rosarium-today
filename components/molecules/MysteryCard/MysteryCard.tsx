import Link from 'next/link'
import { Star, Sun, Gem } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { MYSTERY_GRADIENTS } from '@/lib/constants/mysteries'
import type { MysteryKey } from '@/lib/rosary'

interface MysteryCardProps {
  mysteryKey: MysteryKey
  name: string
  days: string
  meditations: readonly string[]
  isToday: boolean
  href: string
  todayBadge: string
  kicker: string
}

function CatholicCross() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <rect x="10" y="1" width="4" height="22"/>
      <rect x="3" y="8" width="18" height="4"/>
    </svg>
  )
}

const MYSTERY_ICONS: Record<MysteryKey, React.ReactNode> = {
  joyful:    <Star className="w-full h-full" />,
  sorrowful: <CatholicCross />,
  glorious:  <Sun className="w-full h-full" />,
  luminous:  <Gem className="w-full h-full" />,
}

export function MysteryCard({ mysteryKey, name, days, meditations, isToday, href, todayBadge, kicker }: MysteryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'relative rounded-[22px] p-[24px_22px_22px] min-h-[260px] border border-line bg-ink-2',
        'overflow-hidden flex flex-col justify-between',
        'transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
        'no-underline',
        'hover:-translate-y-1 hover:border-gold-dim hover:shadow-[0_24px_60px_-30px_rgba(198,161,91,0.5)]',
        isToday && 'border-gold shadow-[0_0_0_1px_var(--gold-dim)_inset,0_30px_70px_-40px_rgba(198,161,91,0.8)]',
      )}
      style={{ '--card-grad': MYSTERY_GRADIENTS[mysteryKey] } as React.CSSProperties}
    >
      {/* gradient overlay */}
      <span className="absolute inset-0 opacity-55 pointer-events-none" style={{ background: 'var(--card-grad)' }} />

      {isToday && (
        <div className="absolute top-[18px] right-[18px] px-[10px] py-[5px] rounded-full bg-gold text-ink font-ui text-[10px] font-bold tracking-[0.16em] uppercase z-10">
          {todayBadge}
        </div>
      )}

      <div className="relative z-10">
        <div className="w-11 h-11 rounded-[10px] bg-gold-soft border border-gold-dim/60 grid place-items-center p-2.5 text-gold">
          {MYSTERY_ICONS[mysteryKey]}
        </div>
      </div>

      <div className="relative z-10">
        <div className="font-caps font-bold text-[12px] tracking-[0.2em] uppercase text-bone">{kicker}</div>
        <div className="font-display font-medium text-[28px] leading-none text-gold mt-1 mb-3.5">{name}</div>
        <div className="font-ui text-[11px] font-medium tracking-[0.18em] uppercase text-muted">{days}</div>
        <ul className="list-none p-0 mt-3 font-body text-[12.5px] text-muted flex flex-col gap-1">
          {meditations.slice(0, 3).map((m, i) => (
            <li key={i} className="flex gap-2 leading-[1.35]">
              <span className="w-[3px] h-[3px] rounded-full bg-gold mt-2 shrink-0" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}

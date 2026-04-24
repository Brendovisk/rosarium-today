import { Gem, Star, Sun } from "lucide-react";
import Link from "next/link";

import { CatholicCross } from "@/components/atoms/CustomIcons";
import type { MysteryKey } from "@/config/rosary";
import { MYSTERY_GRADIENTS } from "@/config/rosary";
import { cn } from "@/lib/classNames";

type MysteryCardProps = {
  mysteryKey: MysteryKey;
  name: string;
  days: string;
  meditations: readonly string[];
  isToday: boolean;
  href: string;
  todayBadge: string;
  kicker: string;
};

const MYSTERY_ICONS: Record<MysteryKey, React.ReactNode> = {
  joyful: <Star className="w-full h-full" />,
  sorrowful: <CatholicCross />,
  glorious: <Sun className="w-full h-full" />,
  luminous: <Gem className="w-full h-full" />,
};

export function MysteryCard({
  mysteryKey,
  name,
  days,
  meditations,
  isToday,
  href,
  todayBadge,
  kicker,
}: MysteryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-[22px] p-[24px_22px_22px] min-h-[260px] border border-line bg-ink-2",
        "overflow-hidden flex flex-col justify-between",
        "transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
        "no-underline",
        "hover:-translate-y-1 hover:border-gold-dim hover:shadow-[0_24px_60px_-30px_rgba(198,161,91,0.5)]",
        isToday &&
          "border-gold shadow-[0_0_0_1px_var(--gold-dim)_inset,0_30px_70px_-40px_rgba(198,161,91,0.8)]"
      )}
      style={
        { "--card-grad": MYSTERY_GRADIENTS[mysteryKey] } as React.CSSProperties
      }
    >
      <span
        className="absolute inset-0 opacity-55 pointer-events-none"
        style={{ background: "var(--card-grad)" }}
      />

      {isToday && (
        <div className="absolute top-[18px] right-[18px] px-[10px] py-[5px] rounded-full bg-gold text-ink font-ui text-[10px] font-bold tracking-[0.16em] uppercase z-10">
          {todayBadge}
        </div>
      )}

      <div className="relative z-10">
        <div className="w-11 h-11 rounded-[10px] bg-gold-soft border border-gold-dim/60 grid place-items-center p-2.5 mb-4 text-gold">
          {MYSTERY_ICONS[mysteryKey]}
        </div>
      </div>

      <div className="relative z-10">
        <div className="font-ui text-xs tracking-[0.22em] uppercase mb-2">
          {kicker}
        </div>

        <div className="font-display font-normal text-[26px] text-gold text-bone leading-[1.1] mb-2">
          {name}
        </div>

        <div className="font-ui text-[11px] font-semibold tracking-[0.16em] uppercase text-muted mb-2">
          {days}
        </div>

        <ol className="list-none m-0 p-0 flex flex-col gap-[5px]">
          {meditations.map((meditation, i) => (
            <li
              key={i}
              className="font-body text-sm text-muted leading-snug flex items-baseline gap-2"
            >
              <span className="font-ui text-[9px] text-gold-dim shrink-0 w-3 text-right">
                {i + 1}
              </span>
              {meditation}
            </li>
          ))}
        </ol>
      </div>
    </Link>
  );
}

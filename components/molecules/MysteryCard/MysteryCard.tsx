import { Gem, Star, Sun } from "lucide-react";
import Link from "next/link";

import { CatholicCross } from "@/components/atoms/CustomIcons";
import type { MysteryKey } from "@/config/rosary";
import { MYSTERY_GRADIENTS } from "@/config/rosary";
import { cn } from "@/utils/classNames";

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
        "relative rounded-[1.375rem] p-[1.5rem_1.375rem_1.375rem] min-h-65 border border-line bg-ink-2",
        "overflow-hidden flex flex-col justify-between",
        "transition-[transform,translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
        "no-underline",
        "hover:shadow-none sm:hover:-translate-y-1 hover:border-gold-dim sm:hover:shadow-[0_1.5rem_3.75rem_-1.875rem_rgba(198,161,91,0.5)]",
        isToday &&
          "hover:shadow-none border-gold sm:shadow-[0_0_0_0.0625rem_var(--gold-dim)_inset,0_1.875rem_4.375rem_-2.5rem_rgba(198,161,91,0.8)]"
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
        <div className="absolute top-4.5 right-4.5 px-2.5 py-1.25 rounded-full bg-gold text-ink font-ui text-[0.625rem] font-bold tracking-[0.16em] uppercase z-10">
          {todayBadge}
        </div>
      )}

      <div className="relative z-10">
        <div className="w-11 h-11 rounded-[0.625rem] bg-gold-soft border border-gold-dim/60 grid place-items-center p-2.5 mb-4 text-gold">
          {MYSTERY_ICONS[mysteryKey]}
        </div>
      </div>

      <div className="relative z-10">
        <div className="font-ui text-xs tracking-[0.22em] uppercase mb-2">
          {kicker}
        </div>

        <div className="font-display font-normal text-[1.625rem] text-gold leading-[1.1] mb-2">
          {name}
        </div>

        <div className="font-ui text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-muted mb-2">
          {days}
        </div>

        <ol className="list-none m-0 p-0 flex flex-col gap-1.25">
          {meditations.map((meditation, i) => (
            <li
              key={i}
              className="font-body text-sm text-muted leading-snug flex items-baseline gap-2"
            >
              <span className="font-ui text-[0.5625rem] text-gold-dim shrink-0 w-3 text-right">
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

import { BookOpen } from "lucide-react";

const CIRCLE_RADIUS = 24;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

type ReflectionButtonProps = {
  progress: number;
};

export function ReflectionButton({ progress }: ReflectionButtonProps) {
  return (
    <button
      disabled
      className="relative grid size-14 place-items-center rounded-full border border-gold bg-gold-soft text-gold"
      aria-label="Reflection countdown"
    >
      <svg
        viewBox="0 0 56 56"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="28"
          cy="28"
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="var(--line-2)"
          strokeWidth="3"
        />

        <circle
          cx="28"
          cy="28"
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="var(--gold)"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={CIRCLE_CIRCUMFERENCE * (1 - progress)}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <BookOpen size={18} />
    </button>
  );
}

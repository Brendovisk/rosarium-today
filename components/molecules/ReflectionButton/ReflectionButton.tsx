import { BookOpen, Pause, Play } from "lucide-react";
import { useState } from "react";

const CIRCLE_RADIUS = 24;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

type ReflectionButtonProps = {
  progress: number;
  paused: boolean;
  onToggle: () => void;
};

export function ReflectionButton({
  progress,
  paused,
  onToggle,
}: ReflectionButtonProps) {
  const [hovered, setHovered] = useState(false);

  const getIcon = () => {
    if (paused && hovered) return <Play size={18} fill="currentColor" />;

    if (!paused && hovered) return <Pause size={18} fill="currentColor" />;

    if (paused)
      return <Pause size={18} fill="currentColor" className="opacity-50" />;

    return <BookOpen size={18} />;
  };

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative grid size-14 place-items-center rounded-full border border-gold bg-gold-soft text-gold transition-opacity hover:opacity-80"
      aria-label={paused ? "Resume reflection" : "Pause reflection"}
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
          className={paused ? "opacity-50" : undefined}
        />
      </svg>
      {getIcon()}
    </button>
  );
}

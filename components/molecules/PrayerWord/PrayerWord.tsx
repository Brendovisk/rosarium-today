import { cn } from "@/utils/classNames";

type WordState = "active" | "past" | "upcoming";

type PrayerWordProps = {
  word: string;
  state: WordState;
  disabled: boolean;
  onClick: () => void;
  wordRef?: (element: HTMLButtonElement | null) => void;
};

export function PrayerWord({
  word,
  state,
  disabled,
  onClick,
  wordRef,
}: PrayerWordProps) {
  return (
    <button
      ref={wordRef}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "mr-[0.3em] inline transition-colors duration-300",
        state === "active" && "text-gold",
        state === "past" && "text-bone",
        state === "upcoming" && "text-muted-2",
        !disabled && "cursor-pointer hover:text-muted"
      )}
    >
      {word.trim()}
    </button>
  );
}

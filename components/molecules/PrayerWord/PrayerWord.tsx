import { cn } from "@/lib/classNames";

type WordState = "active" | "past" | "upcoming";

type PrayerWordProps = {
  word: string;
  state: WordState;
  onClick: () => void;
  wordRef?: (element: HTMLButtonElement | null) => void;
};

export function PrayerWord({ word, state, onClick, wordRef }: PrayerWordProps) {
  return (
    <button
      ref={wordRef}
      onClick={onClick}
      className={cn(
        "mr-[0.3em] inline cursor-pointer transition-colors duration-300 hover:text-muted",
        state === "active" && "text-gold",
        state === "past" && "text-bone",
        state === "upcoming" && "text-muted-2"
      )}
    >
      {word.trim()}
    </button>
  );
}

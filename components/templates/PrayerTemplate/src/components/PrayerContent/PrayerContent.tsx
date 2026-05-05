import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { PrayerWord } from "@/components/molecules/PrayerWord";
import { AVE_MARIAS_PER_DECADE } from "@/player/rosary-steps";
import { cn } from "@/utils/classNames";

type WordData = {
  word: string;
  start: number;
};

type PrayerContentProps = {
  words: readonly WordData[];
  isLoading: boolean;
  isMysteryAnnouncement: boolean;
  isSilent: boolean;
  activeWordIndex: number;
  lastStartedIndex: number;
  artworkEnabled: boolean;
  theme: "dark" | "light";
  prayerName: string;
  prayerCurrent: number;
  prayerTotal: number;
  progressPercent: number;
  activeDecadeName: string;
  isAve: boolean;
  aveIndex: number;
  onSeekToWord: (start: number) => void;
  wordRef: (index: number) => (element: HTMLButtonElement | null) => void;
};

export function PrayerContent({
  words,
  isLoading,
  isMysteryAnnouncement,
  isSilent,
  activeWordIndex,
  lastStartedIndex,
  artworkEnabled,
  theme,
  prayerName,
  prayerCurrent,
  prayerTotal,
  progressPercent,
  activeDecadeName,
  isAve,
  aveIndex,
  onSeekToWord,
  wordRef,
}: PrayerContentProps) {
  const t = useTranslations("prayer");

  return (
    <section className="relative flex  flex-1 flex-col overflow-hidden lg:min-h-0">
      {!artworkEnabled && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent" />
      )}

      <div className="flex items-center justify-between px-5 pt-8 font-ui text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted sm:px-8 lg:px-12">
        <span>
          {t("stepCounter", { current: prayerCurrent, total: prayerTotal })}
        </span>

        <span>{Math.round(progressPercent)}%</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center text-center">
          <div className="mb-8">
            <h1 className="m-0 font-ui text-sm font-bold uppercase tracking-[0.32em] text-gold">
              {prayerName}
            </h1>
          </div>

          {isMysteryAnnouncement ? (
            <div
              className={cn(
                "mx-auto max-w-xl rounded-[1.375rem] border border-line bg-ink-2 p-8",
                artworkEnabled && "backdrop-blur-sm",
                artworkEnabled && theme === "dark" && "bg-(--ink)/20",
                artworkEnabled && theme === "light" && "bg-(--ink)/20"
              )}
            >
              <BookOpen className="mx-auto mb-5 text-gold" size={28} />

              <div className="font-display text-[2rem] italic text-gold">
                {activeDecadeName}
              </div>

              <p className="mt-4 font-body text-muted">
                {t("contemplateText")}
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-16">
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className="size-1.5 animate-pulse rounded-full bg-gold"
                    style={{ animationDelay: `${index * 160}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="font-display text-[clamp(1.75rem,4vw,2.125rem)] leading-[1.65] font-medium">
              {words.map((word, index) => {
                const isActive = index === activeWordIndex;

                const isPast =
                  index < lastStartedIndex ||
                  (index === lastStartedIndex && !isActive);
                const state = isActive
                  ? "active"
                  : isPast
                  ? "past"
                  : "upcoming";

                return (
                  <PrayerWord
                    key={index}
                    word={word.word}
                    disabled={isSilent}
                    state={state}
                    onClick={() => {
                      if (!isSilent) onSeekToWord(word.start);
                    }}
                    wordRef={wordRef(index)}
                  />
                );
              })}
            </div>
          )}

          {isAve && (
            <div className="mt-8">
              <div className="mb-3 font-ui text-[0.625rem] uppercase tracking-[0.18em] text-muted">
                {t("aveCount")} {aveIndex + 1}/{AVE_MARIAS_PER_DECADE}
              </div>

              <div className="flex justify-center gap-2">
                {Array.from({ length: AVE_MARIAS_PER_DECADE }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "size-2 rounded-full",
                      index <= aveIndex ? "bg-gold" : "bg-line-2"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!artworkEnabled && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-background to-transparent" />
      )}
    </section>
  );
}

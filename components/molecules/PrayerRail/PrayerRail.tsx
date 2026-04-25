"use client";

import { AnimatePresence,motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { MysteryKey } from "@/config/rosary";
import type { VoiceGender } from "@/config/settings";
import {
  AVE_MARIAS_PER_DECADE,
  ESTIMATED_ROSARY_DURATION_MINS,
} from "@/player/rosary-steps";
import { cn } from "@/utils/classNames";

type PrayerRailProps = {
  mysteryKey: MysteryKey;
  decadeIndex: number;
  decades: string[];
  isAve: boolean;
  aveIndex: number;
  remainingMins: number;
  voiceGender: VoiceGender;
  collapsed: boolean;
  onToggle: () => void;
  onJumpToDecade: (decadeIndex: number) => void;
};

export function PrayerRail({
  mysteryKey,
  decadeIndex,
  decades,
  isAve,
  aveIndex,
  remainingMins,
  voiceGender,
  collapsed,
  onToggle,
  onJumpToDecade,
}: PrayerRailProps) {
  const t = useTranslations("prayer");
  const tSettings = useTranslations("settings");

  const mysteryShortName = t(
    `mysteries.${mysteryKey}.shortName` as "mysteries.joyful.shortName"
  );

  const voiceLabel = tSettings(
    voiceGender === "male" ? "voiceMale" : "voiceFemale"
  );

  return (
    <aside
      className={cn(
        "relative hidden xl:flex flex-col h-[calc(100vh-6rem)] border-t border-line bg-black/10 transition-[padding] duration-300 xl:border-l xl:border-t-0"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "absolute top-5  z-50 hidden size-8 place-items-center rounded-full border border-line bg-ink-2 text-muted transition-colors hover:border-gold-dim hover:text-gold xl:grid",
          collapsed ? "left-1/2 -translate-x-1/2" : "-left-4"
        )}
        aria-label={collapsed ? "Expand prayer panel" : "Collapse prayer panel"}
      >
        {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-none p-8">
        {collapsed ? (
          <div className="flex flex-col flex-1 items-center pt-12">
            <div className="font-display text-[2.375rem] text-gold">
              {Math.max(decadeIndex + 1, 1)}
            </div>

            <div className="mt-6 flex flex-col gap-1.5">
              {decades.map((decadeName, index) => (
                <button
                  key={decadeName}
                  onClick={() => onJumpToDecade(index)}
                  className={cn(
                    "size-8 rounded-full border font-ui text-[0.6875rem] transition-colors",
                    index === decadeIndex
                      ? "border-gold bg-gold-soft text-gold"
                      : "border-line text-muted hover:border-line-2 hover:text-bone"
                  )}
                  aria-label={decadeName}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
              className="flex flex-col flex-1"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mb-7 flex items-start justify-between gap-4"
              >
                <div>
                  <h2 className="m-0 font-display text-[1.25rem] font-medium text-bone">
                    {mysteryShortName}
                  </h2>

                  <div className="mt-1 font-ui text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
                    {t("fiveMysteriesLabel")}
                  </div>
                </div>

                <span className="font-ui text-[0.6875rem] text-muted">
                  {Math.max(decadeIndex + 1, 1)}/5
                </span>
              </motion.div>

              <div className="flex flex-col gap-2">
                {decades.map((decadeName, index) => {
                  const isActive = index === decadeIndex;
                  const isComplete = decadeIndex > index;
                  const beadCount =
                    isActive && isAve
                      ? aveIndex + 1
                      : isComplete
                      ? AVE_MARIAS_PER_DECADE
                      : 0;

                  return (
                    <motion.button
                      key={decadeName}
                      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onClick={() => onJumpToDecade(index)}
                      className={cn(
                        "grid grid-cols-[1.25rem_1fr_auto] items-center gap-3 rounded-[0.875rem] px-3 py-3 text-left transition-colors",
                        isActive
                          ? "bg-gold-soft"
                          : "bg-transparent hover:bg-white/3",
                        isComplete && "text-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "font-display text-[1rem] italic",
                          isActive ? "text-gold" : "text-muted-2"
                        )}
                      >
                        {index + 1}
                      </span>

                      <span className="min-w-0">
                        <span className="block font-display text-base text-bone">
                          {decadeName}
                        </span>

                        <span className="font-ui text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                          {isComplete
                            ? t("completing")
                            : isActive && isAve
                            ? `${t("steps.aveMaria")} ${aveIndex + 1}/10`
                            : t("toPray")}
                        </span>
                      </span>

                      <span className="hidden gap-1 sm:flex">
                        {Array.from(
                          { length: AVE_MARIAS_PER_DECADE },
                          (_, beadIndex) => (
                            <span
                              key={beadIndex}
                              className={cn(
                                "size-1 rounded-full",
                                beadIndex < beadCount ? "bg-gold" : "bg-line-2"
                              )}
                            />
                          )
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-7 border-t border-line pt-5"
              >
                <div className="flex items-center justify-between font-ui text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
                  <span>{t("voice")}</span>

                  <span>{voiceLabel}</span>
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-5 border-t border-line pt-5"
              >
                <div className="font-ui text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
                  {t("estimatedDuration")}
                </div>

                <div className="mt-3 font-display text-base text-bone">
                  {ESTIMATED_ROSARY_DURATION_MINS} min · {t("remaining")}{" "}
                  {remainingMins} min
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-20 hidden border-t border-line pt-4 text-center font-display text-sm italic text-muted xl:block"
              >
                Ad Maiorem Dei Gloriam
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </aside>
  );
}

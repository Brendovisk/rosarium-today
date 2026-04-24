"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Repeat,
  Sun,
  Moon,
  Settings,
  Heart,
} from "lucide-react";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import { DonateModal } from "@/components/molecules/DonateModal";
import { PrayerWord } from "@/components/molecules/PrayerWord";
import { cn } from "@/lib/utils/cn";
import { useSettings } from "@/contexts/SettingsContext";
import { useRosaryPlayer } from "@/lib/hooks/useRosaryPlayer";
import { useRosaryProgress } from "@/lib/hooks/useRosaryProgress";
import type { MysteryKey } from "@/lib/rosary";
import type { Locale } from "@/i18n.config";
import type { PlaybackRate } from "@/lib/constants/playback";

interface PrayerTemplateProps {
  locale: Locale;
  mysteryKey: MysteryKey;
}

const STEP_LABEL_KEYS: Record<string, string> = {
  signumCrucis: "steps.signumCrucis",
  symbolumApostolorum: "steps.symbolumApostolorum",
  paterNoster: "steps.paterNoster",
  aveMaria: "steps.aveMaria",
  gloriaPatri: "steps.gloriaPatri",
  oratio: "steps.oratio",
  salveRegina: "steps.salveRegina",
  intercessio: "steps.intercessio",
  mysteryAnnouncement: "steps.mysteryAnnouncement",
};

const PRAYER_NAME_KEYS: Record<string, string> = {
  "signum-crucis": "steps.signumCrucis",
  "symbolum-apostolorum": "steps.symbolumApostolorum",
  "pater-noster": "steps.paterNoster",
  "ave-maria": "steps.aveMaria",
  "gloria-patri": "steps.gloriaPatri",
  "oratio-fatima": "steps.oratio",
  "salve-regina": "steps.salveRegina",
  "intercessio-mariae": "steps.intercessio",
};

export function PrayerTemplate({ locale, mysteryKey }: PrayerTemplateProps) {
  const t = useTranslations("prayer");
  const { voiceGender, theme, toggleTheme } = useSettings();
  const searchParams = useSearchParams();
  const isSilent = searchParams.get("silent") === "1";

  const router = useRouter();

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [mysteryProgress, setMysteryProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoPlayRef = useRef(false);

  const {
    currentStep,
    currentStepIndex,
    steps,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
  } = useRosaryProgress({ mysteryKey });

  // Stable refs so callbacks don't capture stale values
  const canGoNextRef = useRef(canGoNext);
  const goNextRef = useRef(goNext);
  useEffect(() => {
    canGoNextRef.current = canGoNext;
  }, [canGoNext]);
  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  const handleEnded = useCallback(() => {
    if (!isAutoPlay) return;
    if (canGoNextRef.current) {
      shouldAutoPlayRef.current = true;
      goNextRef.current();
    } else {
      setIsCompleted(true);
    }
  }, [isAutoPlay]);

  const {
    audioRef,
    words,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    activeWordIndex,
    lastStartedIndex,
    playbackRate,
    togglePlayPause,
    seekTo,
    seekToWord,
    setPlaybackRate,
  } = useRosaryPlayer({
    prayerKey: currentStep.prayerKey,
    locale,
    voiceGender,
    onEnded: handleEnded,
  });

  const wordRefsMap = useRef<Map<number, HTMLButtonElement>>(new Map());
  const prevActiveWordRef = useRef(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.code === "ArrowRight" && canGoNext) goNext();
      if (e.code === "ArrowLeft" && canGoPrev) goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, goNext, goPrev, canGoNext, canGoPrev]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setHasOverflow(
        el.scrollHeight > el.clientHeight + 2 &&
          el.scrollTop + el.clientHeight < el.scrollHeight - 2
      );
    };
    check();
    el.addEventListener("scroll", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [currentStepIndex]);

  // Auto-start audio when advancing to a prayer step in auto-play mode
  useEffect(() => {
    if (!shouldAutoPlayRef.current) return;
    // Mystery announcements are handled by the countdown effect below
    if (currentStep.prayerKey === null) {
      shouldAutoPlayRef.current = false;
      return;
    }
    shouldAutoPlayRef.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    const play = () => audio.play().catch(() => {});
    if (audio.readyState >= 3) play();
    else audio.addEventListener("canplay", play, { once: true });
  }, [currentStepIndex, currentStep.prayerKey, audioRef]);

  // 8-second countdown on mystery announcement screens during auto-play
  useEffect(() => {
    if (!isAutoPlay || currentStep.prayerKey !== null) return;
    const start = performance.now();
    const DURATION = 8000;
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      setMysteryProgress(progress);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        shouldAutoPlayRef.current = true;
        if (canGoNextRef.current) goNextRef.current();
        else setIsCompleted(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isAutoPlay, currentStepIndex, currentStep.prayerKey]);

  // Scroll active word into view when it changes
  useEffect(() => {
    if (activeWordIndex < 0 || activeWordIndex === prevActiveWordRef.current) return;
    prevActiveWordRef.current = activeWordIndex;
    wordRefsMap.current.get(activeWordIndex)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeWordIndex]);

  // Redirect home after completion glow
  useEffect(() => {
    if (!isCompleted) return;
    const t = setTimeout(() => router.push(`/${locale}`), 2200);
    return () => clearTimeout(t);
  }, [isCompleted, router, locale]);

  const mysteryName = t(`mysteries.${mysteryKey}.name`);
  const decades = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) =>
        t(
          `mysteries.${mysteryKey}.decades.${i}` as `mysteries.joyful.decades.0`
        )
      ),
    [t, mysteryKey]
  );

  const decadeIndex = currentStep.decadeIndex ?? -1;

  const prayerLabel = useMemo(() => {
    const labelKey = STEP_LABEL_KEYS[currentStep.label];
    return labelKey ? t(labelKey as "steps.aveMaria") : currentStep.label;
  }, [currentStep.label, t]);

  const prayerName = useMemo(() => {
    if (!currentStep.prayerKey) return mysteryName;
    const key = PRAYER_NAME_KEYS[currentStep.prayerKey];
    return key ? t(key as "steps.aveMaria") : currentStep.prayerKey;
  }, [currentStep.prayerKey, t, mysteryName]);

  const isMysteryAnnouncement = currentStep.prayerKey === null;
  const pct = ((currentStepIndex + 1) / steps.length) * 100;
  const subtitle =
    isMysteryAnnouncement && decadeIndex >= 0
      ? `${decadeIndex + 1}º mistério: ${decades[decadeIndex]}`
      : prayerLabel;

  const isAve =
    currentStep.label === "aveMaria" && currentStep.aveIndex !== null;
  const aveIdx = currentStep.aveIndex ?? 0;

  const remainingMins = useMemo(() => {
    const stepsLeft = steps.length - currentStepIndex - 1;
    const seconds = stepsLeft * 45 + Math.max(duration - currentTime, 0);
    return Math.round(seconds / 60);
  }, [steps.length, currentStepIndex, duration, currentTime]);

  const CTRL =
    "w-[50px] h-[50px] rounded-full border border-line-2 grid place-items-center text-bone transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed";
  const CTRL_SM =
    "w-10 h-10 rounded-full border border-line-2 grid place-items-center text-bone transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div
      id="root-shell"
      className={cn(
        "min-h-screen grid transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] relative z-[2]",
        leftCollapsed ? "grid-cols-[64px_1fr]" : "grid-cols-[240px_1fr]"
      )}
    >
      <audio ref={audioRef} preload="auto" />

      <AppSidebar
        locale={locale}
        collapsed={leftCollapsed}
        onToggle={() => setLeftCollapsed((c) => !c)}
      />

      <div className="min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-11 py-[22px] border-b border-line sticky top-0 bg-ink/75 backdrop-blur-[14px] z-10 shrink-0">
          <div className="flex items-center gap-[18px] text-muted font-ui text-[13px]">
            <Link
              href={`/${locale}`}
              className="px-2 py-2 inline-flex items-center gap-1 text-muted hover:text-bone transition-colors font-ui text-[13px]"
            >
              <ChevronLeft size={16} /> {t("back")}
            </Link>
            <div>
              <div className="font-display font-medium text-[17px] text-bone">
                {mysteryName}
              </div>
              <div className="font-display italic text-[14px] text-muted">
                {subtitle}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="pl-2 pr-3.5 py-2 rounded-full font-ui text-[12px] font-medium tracking-[0.04em] text-gold border border-gold-dim inline-flex items-center gap-2 transition-colors hover:text-bone hover:border-line"
              onClick={() => setDonateOpen(true)}
            >
              <span className="w-6 h-6 rounded-full bg-gold-soft border border-gold-dim grid place-items-center shrink-0">
                <Heart size={12} />
              </span>
              {t("donate")}
            </button>
            <button
              className="w-9 h-9 grid place-items-center rounded-full border border-line/50 bg-white/3 text-muted hover:text-bone hover:border-gold-dim hover:bg-white/6 transition-colors"
              title={theme === "light" ? "Modo escuro" : "Modo claro"}
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              className="w-9 h-9 grid place-items-center rounded-full border border-line/50 bg-white/3 text-muted hover:text-bone hover:border-gold-dim hover:bg-white/6 transition-colors"
              title="Configurações"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* pray-wrap */}
        <div
          className={cn(
            "flex flex-1 min-h-0 overflow-hidden transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
            "grid",
            railCollapsed ? "grid-cols-[1fr_56px]" : "grid-cols-[1fr_340px]"
          )}
        >
          {/* Main prayer area */}
          <div className="flex flex-col min-h-0 overflow-hidden relative">
            {/* Scroll area */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto px-14 pt-10 pb-8 flex flex-col relative"
            >
              {/* Progress */}
              <div className="relative h-[3px] bg-line rounded-sm overflow-hidden mb-1">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-[#e2c079] transition-[width] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between font-ui text-[11px] text-muted-2 tracking-[0.14em] uppercase mb-7">
                <span>
                  {t("decade")} {currentStepIndex + 1} / {steps.length}
                </span>
                <span>{Math.round(pct)}%</span>
              </div>

              {/* Prayer content */}
              {isMysteryAnnouncement ? (
                <div className="flex-1 grid place-items-center text-center py-7">
                  <div className="text-center">
                    <div className="font-caps font-bold text-[14px] tracking-[0.32em] text-gold mb-7">
                      {decadeIndex + 1}º MISTÉRIO
                    </div>
                    <div className="font-display font-normal text-[34px] leading-[1.45] text-bone max-w-[26ch] text-wrap-pretty">
                      <span className="text-gold italic">
                        {decades[decadeIndex] ?? ""}
                      </span>
                    </div>
                    <p className="font-body italic text-muted mt-7 max-w-[520px]">
                      {t("contemplateText")}
                    </p>
                  </div>
                </div>
              ) : isSilent ? (
                <div className="flex-1 grid place-items-center text-center py-7">
                  <div>
                    <div className="font-caps font-bold text-[14px] tracking-[0.32em] text-gold mb-7">
                      {prayerLabel}
                    </div>
                    <div className="font-display font-normal text-[34px] leading-[1.45] text-bone max-w-[22ch] text-wrap-pretty">
                      {prayerName}
                    </div>
                  </div>
                </div>
              ) : (
                /* Karaoke view */
                <div className="flex-1 py-10">
                  <div className="font-caps font-bold text-[11px] tracking-[0.32em] text-gold mb-8 uppercase">
                    {prayerLabel}
                  </div>
                  {isLoading ? (
                    <div className="flex gap-2 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="font-body text-[1.85rem] leading-[2.15] tracking-wide">
                      {words.map((w, i) => {
                        const state =
                          i === activeWordIndex
                            ? "active"
                            : i <= lastStartedIndex
                              ? "past"
                              : "upcoming";
                        return (
                          <PrayerWord
                            key={i}
                            word={w.word}
                            state={state}
                            onClick={() => seekToWord(w.start)}
                            wordRef={(el) => {
                              if (el) wordRefsMap.current.set(i, el);
                              else wordRefsMap.current.delete(i);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Overflow fade */}
            {hasOverflow && (
              <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-ink/[0.98] to-transparent z-[2]" />
            )}

            {/* Bead row */}
            {isAve && (
              <div className="shrink-0 px-14 pt-[18px] pb-7 flex flex-col gap-1.5 items-center relative z-[2]">
                <div className="font-ui text-[11px] tracking-[0.2em] uppercase text-muted-2 text-center">
                  {t("aveCount")} {aveIdx + 1}/10
                </div>
                <div className="flex gap-2 justify-center mt-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-[background,transform] duration-200",
                        i < aveIdx
                          ? "bg-gold-dim"
                          : i === aveIdx
                          ? "bg-gold scale-[1.4] shadow-[0_0_12px_var(--gold)]"
                          : "bg-line-2"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-[22px] px-14 py-5 border-t border-line bg-ink/85 backdrop-blur-[14px] shrink-0">
              {!isSilent && (
                <button
                  className={cn(
                    CTRL_SM,
                    isAutoPlay && "border-gold text-gold bg-gold-soft"
                  )}
                  onClick={() => setIsAutoPlay((a) => !a)}
                  title={
                    isAutoPlay
                      ? "Desativar reprodução automática"
                      : "Reprodução automática"
                  }
                >
                  <Repeat size={16} />
                </button>
              )}
              <button
                className={CTRL}
                onClick={goPrev}
                disabled={!canGoPrev}
                title="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              {!isSilent &&
                (isAutoPlay && isMysteryAnnouncement ? (
                  /* Mystery countdown spinner */
                  <div className="w-[76px] h-[76px] grid place-items-center">
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 54 54"
                      className="-rotate-90"
                    >
                      <circle
                        cx="27"
                        cy="27"
                        r="21"
                        fill="none"
                        stroke="var(--line-2)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="27"
                        cy="27"
                        r="21"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="2.5"
                        strokeDasharray={`${2 * Math.PI * 21}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 21 * (1 - mysteryProgress)
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <button
                    className="w-[76px] h-[76px] rounded-full bg-gold text-ink border border-gold grid place-items-center shadow-[0_0_28px_rgba(198,161,91,0.45)] transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_40px_rgba(198,161,91,0.65)] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={togglePlayPause}
                    disabled={isLoading || isMysteryAnnouncement}
                    title={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={28} fill="currentColor" />
                    )}
                  </button>
                ))}
              <button
                className={CTRL}
                onClick={goNext}
                disabled={!canGoNext}
                title="Próximo"
              >
                <ChevronRight size={20} />
              </button>
              {!isSilent && (
                <div className="flex gap-1 p-1 rounded-full border border-line font-ui text-[11px] font-semibold">
                  {([0.75, 1, 1.25, 1.5] as PlaybackRate[]).map((rate) => (
                    <button
                      key={rate}
                      className={cn(
                        "px-2.5 py-1.5 rounded-full min-w-[34px] transition-colors",
                        playbackRate === rate
                          ? "bg-gold text-ink"
                          : "text-muted hover:text-bone"
                      )}
                      onClick={() => setPlaybackRate(rate)}
                    >
                      {rate}×
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right rail */}
          <aside
            className={cn(
              "border-l border-line bg-black/[0.18] flex flex-col gap-6 relative transition-[padding] duration-300 overflow-y-auto min-h-0",
              railCollapsed ? "p-2.5" : "p-7 pb-7"
            )}
          >
            <button
              className={cn(
                "absolute w-8 h-8 rounded-full border border-line bg-ink-2 text-muted grid place-items-center z-10",
                "transition-colors hover:text-gold hover:border-gold-dim",
                railCollapsed
                  ? "right-1/2 translate-x-1/2 top-5"
                  : "left-[-14px] top-5"
              )}
              onClick={() => setRailCollapsed((c) => !c)}
              title={railCollapsed ? "Expandir" : "Colapsar"}
            >
              {railCollapsed ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>

            {!railCollapsed && (
              <>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-display font-medium text-[20px] m-0">
                      {mysteryName}
                    </h4>
                    <div className="font-ui font-bold text-[11px] tracking-[0.18em] uppercase text-muted mt-1">
                      {t("fiveMysteriesLabel")}
                    </div>
                  </div>
                  <div className="font-ui text-[11px] tracking-[0.16em] uppercase text-muted">
                    {Math.max(0, decadeIndex)}/5
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  {decades.map((decadeName, i) => {
                    const dn = i + 1;
                    const isActiveDec = dn === decadeIndex + 1;
                    const isDone = dn < decadeIndex + 1;
                    const inDecade =
                      isActiveDec && isAve ? aveIdx : isDone ? 10 : 0;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "grid grid-cols-[24px_1fr_auto] items-center gap-3 px-2 py-3.5 rounded-[10px] cursor-pointer transition-colors",
                          "hover:bg-white/[0.03]",
                          isActiveDec && "bg-gold-soft"
                        )}
                        onClick={() => {
                          const target = steps.findIndex(
                            (s) =>
                              s.type === "mystery-announcement" &&
                              s.decadeIndex === i
                          );
                          if (target >= 0) {
                            for (let j = currentStepIndex; j > target; j--)
                              goPrev();
                            for (let j = currentStepIndex; j < target; j++)
                              goNext();
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "font-display italic text-[20px] text-center",
                            isActiveDec ? "text-gold" : "text-muted-2"
                          )}
                        >
                          {dn}
                        </div>
                        <div>
                          <div
                            className={cn(
                              "font-display text-[16px] leading-[1.2]",
                              isActiveDec ? "text-gold" : "text-bone"
                            )}
                          >
                            {decadeName}
                          </div>
                          <div className="font-ui text-[11px] text-muted-2 tracking-[0.04em]">
                            {isDone
                              ? t("completing")
                              : isActiveDec
                              ? `Ave ${inDecade}/10`
                              : t("toPray")}
                          </div>
                        </div>
                        <div className="flex gap-[3px]">
                          {Array.from({ length: 10 }, (_, j) => (
                            <span
                              key={j}
                              className={cn(
                                "w-[5px] h-[5px] rounded-full",
                                j < inDecade ? "bg-gold" : "bg-line-2"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-line pt-5">
                  <div className="font-ui font-bold text-[11px] tracking-[0.18em] uppercase text-muted">
                    {t("estimatedDuration")}
                  </div>
                  <div className="font-display text-[18px] text-bone mt-1">
                    22 min · {t("remaining")} {remainingMins} min
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-line font-display italic text-[13px] text-muted-2 text-center">
                  ☩ Ad Maiorem Dei Gloriam ☩
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        locale={locale}
      />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      {isCompleted && (
        <div
          className="fixed inset-0 z-300 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(198,161,91,0.5) 0%, rgba(198,161,91,0.15) 50%, transparent 70%)",
            animation: "completionGlow 2.2s ease-in-out forwards",
          }}
        />
      )}
    </div>
  );
}

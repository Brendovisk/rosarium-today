"use client";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Moon,
  Pause,
  Play,
  Repeat,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/atoms/Button";
import { DonateModal } from "@/components/molecules/DonateModal";
import { PrayerRail } from "@/components/molecules/PrayerRail";
import { PrayerWord } from "@/components/molecules/PrayerWord";
import { ReflectionButton } from "@/components/molecules/ReflectionButton";
import { SpeedControl } from "@/components/molecules/SpeedControl";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import type { MysteryKey } from "@/config/rosary";
import { cn } from "@/lib/classNames";
import { useRosaryPlayer } from "@/lib/hooks/use-rosary-player";
import { useRosaryProgress } from "@/lib/hooks/use-rosary-progress";
import type { PrayerKey } from "@/lib/player/assets";
import {
  AVE_MARIAS_PER_DECADE,
  REFLECTION_DURATION_MS,
} from "@/lib/player/rosary-steps";
import { useSettings } from "@/providers/SettingsProvider";

type PrayerTemplateProps = {
  mysteryKey: MysteryKey;
  todaysMystery: MysteryKey;
  isSilent: boolean;
};

const PRAYER_NAME_KEYS: Record<PrayerKey, string> = {
  "signum-crucis": "steps.signumCrucis",
  "symbolum-apostolorum": "steps.symbolumApostolorum",
  "pater-noster": "steps.paterNoster",
  "ave-maria": "steps.aveMaria",
  "gloria-patri": "steps.gloriaPatri",
  "oratio-fatima": "steps.oratio",
  "salve-regina": "steps.salveRegina",
  "intercessio-mariae": "steps.intercessio",
};

export function PrayerTemplate({
  mysteryKey,
  todaysMystery,
  isSilent,
}: PrayerTemplateProps) {
  const t = useTranslations("prayer");
  const router = useRouter();

  const { settings, patchSettings } = useSettings();
  const [donateOpen, setDonateOpen] = useState(false);
  const [reflectionProgress, setReflectionProgress] = useState(0);

  const wordRefsMap = useRef<Map<number, HTMLButtonElement>>(new Map());
  const prevActiveWordRef = useRef(-1);
  const shouldAutoPlayRef = useRef(false);
  const resumeAfterStepNavRef = useRef(false);

  const {
    currentStep,
    currentStepIndex,
    steps,
    canGoNext,
    canGoPrev,
    isProgressHydrated,
    goNext,
    goPrev,
    jumpTo,
    progressPercent,
  } = useRosaryProgress(mysteryKey);

  const handleEnded = useCallback(() => {
    if (!settings.autoPlay) return;

    if (canGoNext) {
      shouldAutoPlayRef.current = true;
      goNext();
    } else {
      router.push("/");
    }
  }, [router, settings.autoPlay, canGoNext, goNext]);

  const {
    audioRef,
    words,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    activeWordIndex,
    lastStartedIndex,
    togglePlayPause,
    seekToWord,
  } = useRosaryPlayer({
    prayerKey: currentStep.prayerKey,
    rosaryStepIndex: currentStepIndex,
    locale: settings.prayerLanguage,
    voiceGender: settings.voiceGender,
    playbackRate: settings.playbackRate,
    onEnded: handleEnded,
  });

  const markResumeIfAudioPlaying = useCallback(() => {
    if (!isSilent && isPlaying && currentStep.prayerKey) {
      resumeAfterStepNavRef.current = true;
    }
  }, [isSilent, isPlaying, currentStep.prayerKey]);

  const goPrevWithResume = useCallback(() => {
    markResumeIfAudioPlaying();
    goPrev();
  }, [goPrev, markResumeIfAudioPlaying]);

  useEffect(() => {
    if (!currentStep.prayerKey || isSilent) {
      resumeAfterStepNavRef.current = false;
      return;
    }

    const playAfterManualNav = resumeAfterStepNavRef.current;
    const playAfterAutoChain = shouldAutoPlayRef.current;

    if (playAfterManualNav) {
      resumeAfterStepNavRef.current = false;
    }

    if (playAfterAutoChain) {
      shouldAutoPlayRef.current = false;
    }

    if (!playAfterManualNav && !playAfterAutoChain) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    queueMicrotask(() => {
      const play = () => void audio.play().catch(() => undefined);

      if (audio.readyState >= 3) {
        play();
      } else {
        audio.addEventListener("canplay", play, { once: true });
      }
    });
  }, [audioRef, currentStep.prayerKey, currentStepIndex, isSilent]);

  useEffect(() => {
    if (activeWordIndex < 0 || activeWordIndex === prevActiveWordRef.current) {
      return;
    }

    prevActiveWordRef.current = activeWordIndex;

    wordRefsMap.current.get(activeWordIndex)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeWordIndex]);

  const mysteryName = t(
    `mysteries.${mysteryKey}.name` as "mysteries.joyful.name"
  );
  const mysteryShortName = t(
    `mysteries.${mysteryKey}.shortName` as "mysteries.joyful.shortName"
  );

  const decades = useMemo(
    () =>
      [0, 1, 2, 3, 4].map((index) =>
        t(
          `mysteries.${mysteryKey}.decades.${index}` as "mysteries.joyful.decades.0"
        )
      ),
    [mysteryKey, t]
  );

  const prayerName = currentStep.prayerKey
    ? t(PRAYER_NAME_KEYS[currentStep.prayerKey] as "steps.aveMaria")
    : mysteryName;
  const decadeIndex = currentStep.decadeIndex ?? -1;
  const activeDecadeName =
    decadeIndex >= 0 ? decades[decadeIndex] : mysteryName;
  const isMysteryAnnouncement = currentStep.prayerKey === null;
  const isAve =
    currentStep.label === "aveMaria" && currentStep.aveIndex !== null;
  const aveIndex = currentStep.aveIndex ?? 0;
  const shouldRunReflectionTimer =
    !isSilent && isMysteryAnnouncement && settings.autoPlay;

  const remainingMins = useMemo(() => {
    const stepsLeft = steps.length - currentStepIndex - 1;
    const seconds = stepsLeft * 45 + Math.max(duration - currentTime, 0);

    return Math.max(0, Math.round(seconds / 60));
  }, [currentStepIndex, currentTime, duration, steps.length]);

  const jumpToDecade = useCallback(
    (targetDecadeIndex: number) => {
      const stepIndex = steps.findIndex(
        (step) =>
          step.type === "mystery-announcement" &&
          step.decadeIndex === targetDecadeIndex
      );

      if (stepIndex >= 0) {
        markResumeIfAudioPlaying();
        jumpTo(stepIndex);
      }
    },
    [steps, jumpTo, markResumeIfAudioPlaying]
  );

  function toggleTheme() {
    patchSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  }

  function toggleLeftMenu() {
    patchSettings({ leftMenuCollapsed: !settings.leftMenuCollapsed });
  }

  function openRightMenu() {
    patchSettings({ rightMenuCollapsed: false });
  }

  function closeRightMenu() {
    patchSettings({ rightMenuCollapsed: true });
  }

  function togglePrayerRail() {
    patchSettings({ prayerRailCollapsed: !settings.prayerRailCollapsed });
  }

  function toggleAutoPlay() {
    patchSettings({ autoPlay: !settings.autoPlay });
  }

  function handleNext() {
    if (canGoNext) {
      markResumeIfAudioPlaying();
      goNext();
    } else {
      router.push("/");
    }
  }

  useEffect(() => {
    if (!shouldRunReflectionTimer) {
      queueMicrotask(() => setReflectionProgress(0));
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / REFLECTION_DURATION_MS, 1);

      setReflectionProgress(progress);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      if (canGoNext) {
        shouldAutoPlayRef.current = true;
        goNext();

        return;
      } else {
        router.push("/");
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [currentStepIndex, router, shouldRunReflectionTimer, canGoNext, goNext]);

  return (
    <div
      className={cn(
        "relative z-2 grid min-h-screen grid-cols-1 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] lg:h-screen lg:overflow-hidden",
        settings.leftMenuCollapsed
          ? "lg:grid-cols-[4rem_1fr]"
          : "lg:grid-cols-[15rem_1fr]"
      )}
    >
      <audio ref={audioRef} preload="auto" />

      <div className="hidden lg:block">
        <AppSidebar
          collapsed={settings.leftMenuCollapsed}
          onToggle={toggleLeftMenu}
          todaysMystery={todaysMystery}
        />
      </div>

      <div className="flex min-h-screen min-w-0 flex-col lg:h-screen lg:min-h-0">
        <header className="sticky top-0 z-10 grid shrink-0 grid-cols-[1fr_auto] items-center gap-4 border-b border-line bg-ink/75 px-5 py-4 backdrop-blur-[0.875rem] sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-11 lg:py-5.5">
          <div className="min-w-0 justify-self-start">
            <Link
              href="/"
              className="mb-1 inline-flex items-center gap-1 font-ui text-sm text-muted transition-colors hover:text-bone"
            >
              <ChevronLeft size={16} />
              {t("back")}
            </Link>
          </div>

          <div className="hidden min-w-0 text-center lg:block">
            <div className="truncate font-display text-[1.125rem] font-medium text-bone">
              {mysteryShortName}
            </div>
            <div className="mt-1 truncate font-display text-[0.8125rem] italic text-muted">
              {decadeIndex >= 0
                ? t("decadeSubtitle", {
                    n: decadeIndex + 1,
                    name: activeDecadeName,
                  })
                : activeDecadeName}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 justify-self-end sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDonateOpen(true)}
              aria-label={t("donate")}
              className="text-muted"
            >
              <Heart size={18} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-muted"
            >
              <Sun className="hidden dark:block" size={18} />
              <Moon className="dark:hidden" size={18} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={openRightMenu}
              aria-label="Settings"
              className="text-muted"
            >
              <Settings size={18} />
            </Button>
          </div>
        </header>

        <main
          className={cn(
            "grid min-h-0 flex-1 grid-cols-1 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
            settings.prayerRailCollapsed
              ? "xl:grid-cols-[minmax(0,1fr)_4rem]"
              : "xl:grid-cols-[minmax(0,1fr)_20rem]"
          )}
        >
          <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-4.3125rem)] xl:h-auto xl:flex min-h-0 xl:flex-col">
            <section className="relative flex min-h-[calc(100vh-12rem)] flex-1 flex-col overflow-hidden lg:min-h-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent" />

              <div className="flex items-center justify-between px-5 pt-8 font-ui text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted sm:px-8 lg:px-12">
                <span>
                  {t("stepCounter", {
                    current: currentStepIndex + 1,
                    total: steps.length,
                  })}
                </span>

                <span>{Math.round(progressPercent)}%</span>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-10 sm:px-8 lg:px-12">
                <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center text-center">
                  <div className="mb-8">
                    <h1 className="m-0 font-ui text-[0.8125rem] font-bold uppercase tracking-[0.32em] text-gold">
                      {prayerName}
                    </h1>
                  </div>

                  {isMysteryAnnouncement ? (
                    <div className="mx-auto max-w-xl rounded-[1.375rem] border border-line bg-ink-2 p-8">
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
                    <div className="font-display text-[clamp(1.75rem,4vw,2.125rem)] leading-[1.65] text-muted">
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
                            state={state}
                            onClick={() => {
                              if (!isSilent) {
                                seekToWord(word.start);
                              }
                            }}
                            wordRef={(element) => {
                              if (element) {
                                wordRefsMap.current.set(index, element);
                              } else {
                                wordRefsMap.current.delete(index);
                              }
                            }}
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
                        {Array.from(
                          { length: AVE_MARIAS_PER_DECADE },
                          (_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "size-2 rounded-full",
                                index <= aveIndex ? "bg-gold" : "bg-line-2"
                              )}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-background to-transparent" />
            </section>

            <div className="border-t border-line bg-ink/90 px-5 py-4 backdrop-blur-xl">
              <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
                {!isSilent && (
                  <Button
                    variant={settings.autoPlay ? "default" : "outline"}
                    size="icon"
                    onClick={toggleAutoPlay}
                    aria-label="Auto play"
                  >
                    <Repeat size={16} />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goPrevWithResume}
                  disabled={!isProgressHydrated || !canGoPrev}
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </Button>

                {!isSilent &&
                  (isMysteryAnnouncement && settings.autoPlay ? (
                    <ReflectionButton progress={reflectionProgress} />
                  ) : (
                    <Button
                      onClick={togglePlayPause}
                      disabled={isLoading || isMysteryAnnouncement}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="size-14"
                    >
                      {isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" />
                      )}
                    </Button>
                  ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </Button>

                {!isSilent && (
                  <div className="block">
                    <SpeedControl
                      rate={settings.playbackRate}
                      onChange={(playbackRate) =>
                        patchSettings({ playbackRate })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <PrayerRail
            mysteryKey={mysteryKey}
            decadeIndex={decadeIndex}
            decades={decades}
            isAve={isAve}
            aveIndex={aveIndex}
            remainingMins={remainingMins}
            voiceGender={settings.voiceGender}
            collapsed={settings.prayerRailCollapsed}
            onToggle={togglePrayerRail}
            onJumpToDecade={jumpToDecade}
          />
        </main>
      </div>

      <SettingsDrawer
        open={!settings.rightMenuCollapsed}
        onClose={closeRightMenu}
      />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

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
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/atoms/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/Tooltip";
import { ArtworkBackground } from "@/components/molecules/ArtworkBackground";
import { DonateModal } from "@/components/molecules/DonateModal";
import { PrayerRail } from "@/components/molecules/PrayerRail";
import { PrayerWord } from "@/components/molecules/PrayerWord";
import { ReflectionButton } from "@/components/molecules/ReflectionButton";
import { ShortcutsModal } from "@/components/molecules/ShortcutsModal";
import { SpeedControl } from "@/components/molecules/SpeedControl";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import { getAccentVars } from "@/config/accents";
import type { MysteryKey } from "@/config/rosary";
import { PLAYBACK_RATES } from "@/config/settings";
import { useBinauralAudio } from "@/hooks/use-binaural-audio";
import { recordCompletion } from "@/hooks/use-prayer-history";
import { useRosaryPlayer } from "@/hooks/use-rosary-player";
import { useRosaryProgress } from "@/hooks/use-rosary-progress";
import type { PrayerKey } from "@/player/assets";
import {
  AVE_MARIAS_PER_DECADE,
  REFLECTION_DURATION_MS,
} from "@/player/rosary-steps";
import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/classNames";
import { isMacOS } from "@/utils/platform";

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
  const tControls = useTranslations("controls");
  const tSettings = useTranslations("settings");
  const router = useRouter();

  const { settings, patchSettings } = useSettings();
  const [donateOpen, setDonateOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [reflectionProgress, setReflectionProgress] = useState(0);

  const wordRefsMap = useRef<Map<number, HTMLButtonElement>>(new Map());
  const prevActiveWordRef = useRef(-1);
  const shouldAutoPlayRef = useRef(true);
  const hasAutoStartedRef = useRef(false);
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
    resetProgress,
    progressPercent,
  } = useRosaryProgress(mysteryKey);

  const handleEnded = useCallback(() => {
    if (!settings.autoPlay) return;

    if (canGoNext) {
      shouldAutoPlayRef.current = true;
      goNext();
    } else {
      recordCompletion(mysteryKey);
      resetProgress();
      router.push("/");
    }
  }, [router, settings.autoPlay, canGoNext, goNext, resetProgress, mysteryKey]);

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

  useBinauralAudio(
    !isSilent && settings.binauralEnabled,
    settings.binauralVolume
  );

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

  useEffect(() => {
    if (isSilent || !isProgressHydrated) return;
    if (hasAutoStartedRef.current) return;
    if (!currentStep.prayerKey) return;

    const audio = audioRef.current;
    if (!audio) return;

    hasAutoStartedRef.current = true;
    const play = () => void audio.play().catch(() => undefined);

    if (audio.readyState >= 3) {
      play();
    } else {
      audio.addEventListener("canplay", play, { once: true });
    }
  }, [audioRef, currentStep.prayerKey, isProgressHydrated, isSilent]);

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

  const toggleLeftMenu = useCallback(() => {
    patchSettings({ leftMenuCollapsed: !settings.leftMenuCollapsed });
  }, [patchSettings, settings.leftMenuCollapsed]);

  function openRightMenu() {
    patchSettings({ rightMenuCollapsed: false });
  }

  function closeRightMenu() {
    patchSettings({ rightMenuCollapsed: true });
  }

  const togglePrayerRail = useCallback(() => {
    patchSettings({ prayerRailCollapsed: !settings.prayerRailCollapsed });
  }, [patchSettings, settings.prayerRailCollapsed]);

  function toggleAutoPlay() {
    patchSettings({ autoPlay: !settings.autoPlay });
  }

  const increasePlaybackRate = useCallback(() => {
    const currentIndex = PLAYBACK_RATES.indexOf(settings.playbackRate);
    if (currentIndex < 0) return;

    const nextRate =
      PLAYBACK_RATES[Math.min(currentIndex + 1, PLAYBACK_RATES.length - 1)];
    patchSettings({ playbackRate: nextRate });
  }, [patchSettings, settings.playbackRate]);

  const decreasePlaybackRate = useCallback(() => {
    const currentIndex = PLAYBACK_RATES.indexOf(settings.playbackRate);
    if (currentIndex < 0) return;

    const nextRate = PLAYBACK_RATES[Math.max(currentIndex - 1, 0)];
    patchSettings({ playbackRate: nextRate });
  }, [patchSettings, settings.playbackRate]);

  const handleNext = useCallback(() => {
    if (canGoNext) {
      markResumeIfAudioPlaying();
      goNext();
    } else {
      recordCompletion(mysteryKey);
      resetProgress();
      router.push("/");
    }
  }, [
    canGoNext,
    goNext,
    markResumeIfAudioPlaying,
    resetProgress,
    router,
    mysteryKey,
  ]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const mod = isMacOS() ? e.metaKey : e.ctrlKey;

      if (mod && e.key === ".") {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (mod && e.key === ",") {
        e.preventDefault();
        patchSettings({ rightMenuCollapsed: false });
        return;
      }

      if (mod && (e.key === "'" || e.code === "Quote")) {
        e.preventDefault();
        togglePrayerRail();
        return;
      }

      if (mod && e.key === "/") {
        e.preventDefault();
        toggleLeftMenu();
        return;
      }

      if (e.key === "Escape") {
        setShortcutsOpen(false);
        return;
      }

      if (mod) return;

      if (e.key === " " && !isSilent) {
        e.preventDefault();
        if (!isMysteryAnnouncement) togglePlayPause();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevWithResume();
        return;
      }

      if (e.key === "a" || e.key === "A") {
        patchSettings({ autoPlay: !settings.autoPlay });
        return;
      }

      if (e.key === ">") {
        e.preventDefault();
        increasePlaybackRate();
        return;
      }

      if (e.key === "<") {
        e.preventDefault();
        decreasePlaybackRate();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isSilent,
    isMysteryAnnouncement,
    togglePlayPause,
    handleNext,
    goPrevWithResume,
    patchSettings,
    settings.autoPlay,
    togglePrayerRail,
    toggleLeftMenu,
    increasePlaybackRate,
    decreasePlaybackRate,
  ]);

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
        recordCompletion(mysteryKey);
        resetProgress();
        router.push("/");
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [
    currentStepIndex,
    router,
    shouldRunReflectionTimer,
    canGoNext,
    goNext,
    resetProgress,
    mysteryKey,
  ]);

  const forceDark = settings.artworkEnabled && settings.theme === "light";
  const darkAccentVars = forceDark
    ? getAccentVars(settings.accent, "dark")
    : null;

  return (
    <div
      className={cn(
        "relative z-2 grid min-h-screen grid-cols-1 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] lg:h-screen lg:overflow-hidden",
        settings.leftMenuCollapsed
          ? "lg:grid-cols-[4rem_1fr]"
          : "lg:grid-cols-[15rem_1fr]",
        forceDark && "dark force-dark"
      )}
      style={
        darkAccentVars
          ? ({
              "--gold": darkAccentVars.gold,
              "--gold-dim": darkAccentVars.dim,
              "--gold-soft": darkAccentVars.soft,
            } as CSSProperties)
          : undefined
      }
    >
      <audio ref={audioRef} preload="auto" />

      <ArtworkBackground
        mysteryKey={mysteryKey}
        decadeIndex={decadeIndex}
        visible={settings.artworkEnabled}
      />

      <div className="hidden lg:block">
        <AppSidebar
          collapsed={settings.leftMenuCollapsed}
          onToggle={toggleLeftMenu}
          todaysMystery={todaysMystery}
          artworkEnabled={settings.artworkEnabled}
        />
      </div>

      <div className="flex min-h-screen min-w-0 flex-col lg:h-screen lg:min-h-0">
        <header
          className={cn(
            "sticky top-0 z-10 grid shrink-0 grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-11 lg:py-5.5",
            settings.artworkEnabled
              ? ""
              : "border-b border-line bg-ink/75 backdrop-blur-[0.875rem]"
          )}
        >
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
            <div className="mt-1 truncate font-display text-sm italic text-muted">
              {decadeIndex >= 0
                ? t("decadeSubtitle", {
                    n: decadeIndex + 1,
                    name: activeDecadeName,
                  })
                : activeDecadeName}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 justify-self-end sm:gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDonateOpen(true)}
                  aria-label={t("donate")}
                  className="text-muted"
                >
                  <Heart size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("donate")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>{tControls("toggleTheme")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openRightMenu}
                  aria-label={tSettings("title")}
                  className="text-muted"
                >
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tSettings("title")}</TooltipContent>
            </Tooltip>
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
          <div className="grid grid-rows-[1fr_auto] h-[calc(100svh-4.3125rem)] xl:h-auto xl:flex min-h-0 xl:flex-col">
            <section className="relative flex min-h-[calc(100svh-12rem)] flex-1 flex-col overflow-hidden lg:min-h-0">
              {!settings.artworkEnabled && (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent" />
              )}

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
                    <h1 className="m-0 font-ui text-sm font-bold uppercase tracking-[0.32em] text-gold">
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

              {!settings.artworkEnabled && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-background to-transparent" />
              )}
            </section>

            <div
              className={cn(
                "px-5 py-4",
                settings.artworkEnabled
                  ? ""
                  : "border-t border-line bg-ink/90 backdrop-blur-xl"
              )}
            >
              <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
                {!isSilent && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={settings.autoPlay ? "default" : "outline"}
                        size="icon"
                        onClick={toggleAutoPlay}
                        aria-label="Auto play"
                      >
                        <Repeat size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{tControls("autoplay")}</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goPrevWithResume}
                      disabled={!canGoPrev}
                      suppressHydrationWarning
                      aria-label="Previous"
                    >
                      <ChevronLeft size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tControls("previous")}</TooltipContent>
                </Tooltip>

                {!isSilent &&
                  (isMysteryAnnouncement && settings.autoPlay ? (
                    <ReflectionButton progress={reflectionProgress} />
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={togglePlayPause}
                          disabled={isLoading || isMysteryAnnouncement}
                          aria-label={
                            isPlaying ? tControls("pause") : tControls("play")
                          }
                          className="size-14"
                        >
                          {isPlaying ? (
                            <Pause size={20} fill="currentColor" />
                          ) : (
                            <Play size={22} fill="currentColor" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isPlaying ? tControls("pause") : tControls("play")}
                      </TooltipContent>
                    </Tooltip>
                  ))}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      aria-label="Next"
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tControls("next")}</TooltipContent>
                </Tooltip>

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
            artworkEnabled={settings.artworkEnabled}
          />
        </main>
      </div>

      <SettingsDrawer
        open={!settings.rightMenuCollapsed}
        onClose={closeRightMenu}
        onShortcuts={() => setShortcutsOpen(true)}
      />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      <ShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

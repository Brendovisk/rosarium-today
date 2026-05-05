"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ArtworkBackground } from "@/components/molecules/ArtworkBackground";
import { DonateModal } from "@/components/molecules/DonateModal";
import { PrayerRail } from "@/components/molecules/PrayerRail";
import { ShortcutsModal } from "@/components/molecules/ShortcutsModal";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import type { MysteryKey } from "@/config/rosary";
import { getStepArtwork } from "@/config/rosary";
import { PLAYBACK_RATES, PlaybackRate } from "@/config/settings";
import { useBinauralAudio } from "@/hooks/use-binaural-audio";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { recordCompletion } from "@/hooks/use-prayer-history";
import { useRosaryPlayer } from "@/hooks/use-rosary-player";
import { useRosaryProgress } from "@/hooks/use-rosary-progress";
import type { PrayerKey } from "@/player/assets";
import { REFLECTION_DURATION_MS } from "@/player/rosary-steps";
import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/classNames";

import { PrayerContent } from "./src/components/PrayerContent";
import { PrayerControls } from "./src/components/PrayerControls";
import { PrayerHeader } from "./src/components/PrayerHeader";

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
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [reflectionProgress, setReflectionProgress] = useState(0);
  const [reflectionPaused, setReflectionPaused] = useState(false);
  const reflectionElapsedRef = useRef(0);

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

  useBinauralAudio(settings.binauralEnabled, settings.binauralVolume);

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

    if (playAfterManualNav) resumeAfterStepNavRef.current = false;
    if (playAfterAutoChain) shouldAutoPlayRef.current = false;

    if (!playAfterManualNav && !playAfterAutoChain) return;

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
    if (activeWordIndex < 0 || activeWordIndex === prevActiveWordRef.current)
      return;
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
  const artwork = getStepArtwork(mysteryKey, currentStep);
  const activeDecadeName =
    decadeIndex >= 0 ? decades[decadeIndex] : mysteryName;
  const isMysteryAnnouncement = currentStep.prayerKey === null;

  const prayerTotal = steps.filter(
    (s) => s.type !== "mystery-announcement"
  ).length;
  const prayerCurrent = steps
    .slice(0, isMysteryAnnouncement ? currentStepIndex : currentStepIndex + 1)
    .filter((s) => s.type !== "mystery-announcement").length;

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

  const toggleTheme = () => {
    patchSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  };

  const toggleLeftMenu = useCallback(() => {
    patchSettings({ leftMenuCollapsed: !settings.leftMenuCollapsed });
  }, [patchSettings, settings.leftMenuCollapsed]);

  const togglePrayerRail = useCallback(() => {
    patchSettings({ prayerRailCollapsed: !settings.prayerRailCollapsed });
  }, [patchSettings, settings.prayerRailCollapsed]);

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

  useKeyboardShortcuts((e, mod) => {
    switch (true) {
      case mod && e.key === ".":
        e.preventDefault();
        setShortcutsOpen(true);
        break;
      case mod && e.key === ",":
        e.preventDefault();
        patchSettings({ rightMenuCollapsed: false });
        break;
      case mod && (e.key === "'" || e.code === "Quote"):
        e.preventDefault();
        togglePrayerRail();
        break;
      case mod && e.key === "/":
        e.preventDefault();
        toggleLeftMenu();
        break;
      case e.key === "Escape":
        setShortcutsOpen(false);
        break;
      case !mod && e.key === " " && !isSilent:
        e.preventDefault();
        if (!isMysteryAnnouncement) togglePlayPause();
        break;
      case !mod && e.key === "ArrowRight":
        e.preventDefault();
        handleNext();
        break;
      case !mod && e.key === "ArrowLeft":
        e.preventDefault();
        goPrevWithResume();
        break;
      case !mod && (e.key === "a" || e.key === "A"):
        e.preventDefault();
        patchSettings({ autoPlay: !settings.autoPlay });
        break;
      case !mod && e.key === ">":
        e.preventDefault();
        increasePlaybackRate();
        break;
      case !mod && e.key === "<":
        e.preventDefault();
        decreasePlaybackRate();
        break;
    }
  });

  useEffect(() => {
    queueMicrotask(() => setReflectionPaused(false));
  }, [currentStepIndex]);

  useEffect(() => {
    if (!shouldRunReflectionTimer) {
      reflectionElapsedRef.current = 0;
      queueMicrotask(() => setReflectionProgress(0));
      return;
    }

    if (reflectionPaused) return;

    let frameId = 0;
    const startedAt = performance.now() - reflectionElapsedRef.current;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / REFLECTION_DURATION_MS, 1);
      setReflectionProgress(progress);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      reflectionElapsedRef.current = 0;
      if (canGoNext) {
        shouldAutoPlayRef.current = true;
        goNext();
      } else {
        recordCompletion(mysteryKey);
        resetProgress();
        router.push("/");
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      reflectionElapsedRef.current = performance.now() - startedAt;
    };
  }, [
    currentStepIndex,
    router,
    shouldRunReflectionTimer,
    reflectionPaused,
    canGoNext,
    goNext,
    resetProgress,
    mysteryKey,
  ]);

  const wordRef = useCallback(
    (index: number) => (element: HTMLButtonElement | null) => {
      if (element) {
        wordRefsMap.current.set(index, element);

        return;
      }

      wordRefsMap.current.delete(index);
    },
    []
  );

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

      <ArtworkBackground
        artwork={artwork}
        visible={settings.artworkEnabled}
        isMysteryAnnouncement={isMysteryAnnouncement}
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
        <PrayerHeader
          mysteryShortName={mysteryShortName}
          decadeIndex={decadeIndex}
          activeDecadeName={activeDecadeName}
          artworkEnabled={settings.artworkEnabled}
          binauralEnabled={settings.binauralEnabled}
          onDonate={() => setDonateOpen(true)}
          onToggleTheme={toggleTheme}
          onToggleBinaural={() =>
            patchSettings({ binauralEnabled: !settings.binauralEnabled })
          }
          onToggleArtwork={() =>
            patchSettings({ artworkEnabled: !settings.artworkEnabled })
          }
          onOpenSettings={() => patchSettings({ rightMenuCollapsed: false })}
        />

        <main
          className={cn(
            "grid min-h-0 flex-1 grid-cols-1 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
            settings.prayerRailCollapsed
              ? "xl:grid-cols-[minmax(0,1fr)_4rem]"
              : "xl:grid-cols-[minmax(0,1fr)_20rem]"
          )}
        >
          <div className="grid grid-rows-[1fr_auto] h-[calc(100svh-4.3125rem)] xl:h-auto xl:flex min-h-0 xl:flex-col">
            <PrayerContent
              words={words}
              isLoading={isLoading}
              isMysteryAnnouncement={isMysteryAnnouncement}
              isSilent={isSilent}
              activeWordIndex={activeWordIndex}
              lastStartedIndex={lastStartedIndex}
              artworkEnabled={settings.artworkEnabled}
              theme={settings.theme}
              prayerName={prayerName}
              prayerCurrent={prayerCurrent}
              prayerTotal={prayerTotal}
              progressPercent={progressPercent}
              activeDecadeName={activeDecadeName}
              isAve={isAve}
              aveIndex={aveIndex}
              onSeekToWord={seekToWord}
              wordRef={wordRef}
            />

            <PrayerControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              isSilent={isSilent}
              isMysteryAnnouncement={isMysteryAnnouncement}
              artworkEnabled={settings.artworkEnabled}
              autoPlay={settings.autoPlay}
              playbackRate={settings.playbackRate}
              reflectionProgress={reflectionProgress}
              reflectionPaused={reflectionPaused}
              onToggleAutoPlay={() =>
                patchSettings({ autoPlay: !settings.autoPlay })
              }
              onPrev={goPrevWithResume}
              onNext={handleNext}
              onPlayPause={togglePlayPause}
              onToggleReflectionPause={() => setReflectionPaused((p) => !p)}
              onRateChange={(playbackRate: PlaybackRate) =>
                patchSettings({ playbackRate })
              }
            />
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
        onClose={() => patchSettings({ rightMenuCollapsed: true })}
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

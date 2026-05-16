"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArtworkBackground } from "@/components/molecules/ArtworkBackground";
import { DonateModal } from "@/components/molecules/DonateModal";
import { PrayerRail } from "@/components/molecules/PrayerRail";
import { ShortcutsModal } from "@/components/molecules/ShortcutsModal";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { SettingsDrawer } from "@/components/organisms/SettingsDrawer";
import type { MysteryKey } from "@/config/rosary";
import type { PrayerKey } from "@/config/rosary";
import {
  FULL_ROSARY_ORDER,
  getFullRosaryProgressStorageKey,
  getStepArtwork,
  getTodaysMystery,
} from "@/config/rosary";
import {
  DECADES_PER_ROSARY,
  ESTIMATED_ROSARY_DURATION_MINS,
  FULL_ROSARY_PRAYER_STEP_OFFSETS,
  FULL_ROSARY_PRAYER_STEPS,
  REFLECTION_DURATION_MS,
  ROSARY_STEPS_DECADES_ONLY,
  ROSARY_STEPS_NO_CLOSING,
  ROSARY_STEPS_NO_OPENING,
} from "@/config/rosary";
import { PLAYBACK_RATES, PlaybackRate } from "@/config/settings";
import { useBinauralAudio } from "@/hooks/use-binaural-audio";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { recordCompletion } from "@/hooks/use-prayer-history";
import { useRosaryPlayer } from "@/hooks/use-rosary-player";
import { useRosaryProgress } from "@/hooks/use-rosary-progress";
import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/classNames";

import { PrayerContent } from "./PrayerContent";
import { PrayerControls } from "./PrayerControls";
import { PrayerHeader } from "./PrayerHeader";

type PrayerTemplateProps = {
  mysteryKey: MysteryKey;
  todaysMystery: MysteryKey;
  fullRosary: boolean;
  onFullRosaryAdvance?: () => void;
  onFullRosaryComplete?: () => void;
};

const PRAYER_NAME_KEYS: Record<PrayerKey, string> = {
  "signum-crucis": "steps.signumCrucis",
  "symbolum-apostolorum": "steps.symbolumApostolorum",
  "pater-noster": "steps.paterNoster",
  "ave-maria": "steps.aveMaria",
  "gloria-patri": "steps.gloriaPatri",
  "oratio-fatima": "steps.oratio",
  "salve-regina": "steps.salveRegina",
  "miraculous-medal": "steps.miraculousMedal",
};

export function PrayerTemplate({
  mysteryKey,
  todaysMystery: serverTodaysMystery,
  fullRosary,
  onFullRosaryAdvance,
  onFullRosaryComplete,
}: PrayerTemplateProps) {
  const [todaysMystery, setTodaysMystery] = useState(serverTodaysMystery);

  useLayoutEffect(() => setTodaysMystery(getTodaysMystery()), []);

  const t = useTranslations("prayer");
  const router = useRouter();

  const { settings, patchSettings } = useSettings();

  const isSilent = !settings.audioEnabled;

  const fullRosaryIndex = fullRosary
    ? FULL_ROSARY_ORDER.indexOf(mysteryKey)
    : -1;
  const isFullRosary = fullRosaryIndex >= 0;
  const isIntermediateRosary = isFullRosary && fullRosaryIndex < 3;

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
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const fullRosarySteps = isFullRosary
    ? fullRosaryIndex === 0
      ? ROSARY_STEPS_NO_CLOSING
      : fullRosaryIndex === 3
      ? ROSARY_STEPS_NO_OPENING
      : ROSARY_STEPS_DECADES_ONLY
    : undefined;

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
  } = useRosaryProgress(
    mysteryKey,
    fullRosarySteps,
    undefined,
    isFullRosary ? getFullRosaryProgressStorageKey(mysteryKey) : undefined
  );

  const navigateToNextMysteryInFullRosary = useCallback(() => {
    if (!isFullRosary || fullRosaryIndex < 0 || fullRosaryIndex >= 3) return;
    recordCompletion(mysteryKey);
    resetProgress();
    onFullRosaryAdvance?.();
  }, [
    isFullRosary,
    fullRosaryIndex,
    mysteryKey,
    resetProgress,
    onFullRosaryAdvance,
  ]);

  const handleEnded = useCallback(() => {
    if (!settings.autoPlay) return;

    if (canGoNext) {
      shouldAutoPlayRef.current = true;
      goNext();
    } else if (isIntermediateRosary) {
      navigateToNextMysteryInFullRosary();
    } else {
      if (isFullRosary) onFullRosaryComplete?.();
      recordCompletion(mysteryKey);
      resetProgress();
      router.push("/");
    }
  }, [
    router,
    settings.autoPlay,
    canGoNext,
    goNext,
    resetProgress,
    mysteryKey,
    isIntermediateRosary,
    isFullRosary,
    onFullRosaryComplete,
    navigateToNextMysteryInFullRosary,
  ]);

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

  useEffect(() => {
    if (!isSilent) return;
    audioRef.current?.pause();
  }, [isSilent, audioRef]);

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

  const mysteryShortName = isFullRosary
    ? t("fullRosaryTitle")
    : t(`mysteries.${mysteryKey}.shortName` as "mysteries.joyful.shortName");

  const decades = useMemo(
    () =>
      [0, 1, 2, 3, 4].map((index) =>
        t(
          `mysteries.${mysteryKey}.decades.${index}` as "mysteries.joyful.decades.0"
        )
      ),
    [mysteryKey, t]
  );

  const descriptions = useMemo(
    () =>
      [0, 1, 2, 3, 4].map((index) =>
        t(
          `mysteries.${mysteryKey}.descriptions.${index}` as "mysteries.joyful.descriptions.0"
        )
      ),
    [mysteryKey, t]
  );

  // All 20 mysteries' decade names for full rosary rail display
  const fullRosaryAllDecades = useMemo(() => {
    if (!isFullRosary) return null;
    const result: string[] = [];
    for (const mk of FULL_ROSARY_ORDER) {
      for (let i = 0; i < DECADES_PER_ROSARY; i++) {
        result.push(
          t(`mysteries.${mk}.decades.${i}` as "mysteries.joyful.decades.0")
        );
      }
    }
    return result;
  }, [isFullRosary, t]);

  const prayerName = currentStep.prayerKey
    ? t(PRAYER_NAME_KEYS[currentStep.prayerKey] as "steps.aveMaria")
    : mysteryName;
  const decadeIndex = currentStep.decadeIndex ?? -1;
  const artwork = getStepArtwork(mysteryKey, currentStep);
  const activeDecadeName =
    decadeIndex >= 0 ? decades[decadeIndex] : mysteryName;
  const activeDecadeDescription =
    decadeIndex >= 0 ? descriptions[decadeIndex] : "";
  const isMysteryAnnouncement = currentStep.prayerKey === null;

  const prayerTotal = steps.filter(
    (s) => s.type !== "mystery-announcement"
  ).length;
  const prayerCurrent = steps
    .slice(0, isMysteryAnnouncement ? currentStepIndex : currentStepIndex + 1)
    .filter((s) => s.type !== "mystery-announcement").length;

  // Global step counters for full rosary mode
  const displayPrayerCurrent = isFullRosary
    ? (FULL_ROSARY_PRAYER_STEP_OFFSETS[fullRosaryIndex] ?? 0) + prayerCurrent
    : prayerCurrent;
  const displayPrayerTotal = isFullRosary
    ? FULL_ROSARY_PRAYER_STEPS
    : prayerTotal;

  const isAve =
    currentStep.label === "aveMaria" && currentStep.aveIndex !== null;
  const aveIndex = currentStep.aveIndex ?? 0;
  const shouldRunReflectionTimer =
    !isSilent && isMysteryAnnouncement && settings.autoPlay;

  const remainingMins = useMemo(() => {
    const stepsLeft = steps.length - currentStepIndex - 1;
    const secondsCurrent = stepsLeft * 45 + Math.max(duration - currentTime, 0);
    const currentMins = Math.max(0, Math.round(secondsCurrent / 60));
    const remainingRosaries = isFullRosary
      ? Math.max(0, 3 - fullRosaryIndex)
      : 0;
    return currentMins + remainingRosaries * ESTIMATED_ROSARY_DURATION_MINS;
  }, [
    currentStepIndex,
    currentTime,
    duration,
    steps.length,
    isFullRosary,
    fullRosaryIndex,
  ]);

  const estimatedMins = isFullRosary
    ? ESTIMATED_ROSARY_DURATION_MINS * 4
    : ESTIMATED_ROSARY_DURATION_MINS;

  // Global decade index for rail display (0-19 in full rosary, 0-4 otherwise)
  const railDecadeIndex =
    isFullRosary && decadeIndex >= 0
      ? fullRosaryIndex * DECADES_PER_ROSARY + decadeIndex
      : decadeIndex;

  // Range of the current rosary within the 20-mystery list
  const currentRosaryDecadeRange = isFullRosary
    ? {
        start: fullRosaryIndex * DECADES_PER_ROSARY,
        end: fullRosaryIndex * DECADES_PER_ROSARY + DECADES_PER_ROSARY - 1,
      }
    : undefined;

  const jumpToDecade = useCallback(
    (globalOrLocalDecadeIndex: number) => {
      const localDecadeIndex = isFullRosary
        ? globalOrLocalDecadeIndex - fullRosaryIndex * DECADES_PER_ROSARY
        : globalOrLocalDecadeIndex;

      if (localDecadeIndex < 0 || localDecadeIndex >= DECADES_PER_ROSARY)
        return;

      const stepIndex = steps.findIndex(
        (step) =>
          step.type === "mystery-announcement" &&
          step.decadeIndex === localDecadeIndex
      );

      if (stepIndex >= 0) {
        markResumeIfAudioPlaying();
        jumpTo(stepIndex);
      }
    },
    [steps, jumpTo, markResumeIfAudioPlaying, isFullRosary, fullRosaryIndex]
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
    } else if (isIntermediateRosary) {
      navigateToNextMysteryInFullRosary();
    } else {
      if (isFullRosary) onFullRosaryComplete?.();
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
    isIntermediateRosary,
    isFullRosary,
    onFullRosaryComplete,
    navigateToNextMysteryInFullRosary,
  ]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      touchStartRef.current = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) handleNext();
      else goPrevWithResume();
    },
    [handleNext, goPrevWithResume]
  );

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
        if (donateOpen) {
          setDonateOpen(false);
          break;
        }
        if (shortcutsOpen) {
          setShortcutsOpen(false);
          break;
        }
        patchSettings({ rightMenuCollapsed: true });
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
      } else if (isIntermediateRosary) {
        navigateToNextMysteryInFullRosary();
      } else {
        if (isFullRosary) onFullRosaryComplete?.();
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
    isIntermediateRosary,
    isFullRosary,
    onFullRosaryComplete,
    navigateToNextMysteryInFullRosary,
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
        "relative z-2 grid h-svh grid-cols-1 overflow-hidden transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
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

      <div className="flex h-svh min-w-0 flex-col lg:min-h-0">
        <PrayerHeader
          mysteryShortName={mysteryShortName}
          decadeIndex={decadeIndex}
          activeDecadeName={activeDecadeName}
          artworkEnabled={settings.artworkEnabled}
          binauralEnabled={settings.binauralEnabled}
          audioEnabled={settings.audioEnabled}
          onDonate={() => setDonateOpen(true)}
          onToggleTheme={toggleTheme}
          onToggleBinaural={() =>
            patchSettings({ binauralEnabled: !settings.binauralEnabled })
          }
          onToggleArtwork={() =>
            patchSettings({ artworkEnabled: !settings.artworkEnabled })
          }
          onToggleAudio={() =>
            patchSettings({ audioEnabled: !settings.audioEnabled })
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
          <div
            className="grid grid-rows-[1fr_auto] h-[calc(100svh-4.5rem)] xl:h-[calc(100svh-4.3125rem)] xl:h-auto xl:flex min-h-0 xl:flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <PrayerContent
              words={words}
              isLoading={isLoading}
              isMysteryAnnouncement={isMysteryAnnouncement}
              isSilent={isSilent}
              activeWordIndex={isSilent ? -1 : activeWordIndex}
              lastStartedIndex={isSilent ? -1 : lastStartedIndex}
              artworkEnabled={settings.artworkEnabled}
              theme={settings.theme}
              prayerName={prayerName}
              prayerCurrent={displayPrayerCurrent}
              prayerTotal={displayPrayerTotal}
              progressPercent={progressPercent}
              activeDecadeName={activeDecadeName}
              activeDecadeDescription={activeDecadeDescription}
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
            titleOverride={isFullRosary ? mysteryShortName : undefined}
            decadeIndex={railDecadeIndex}
            decades={fullRosaryAllDecades ?? decades}
            currentRosaryDecadeRange={currentRosaryDecadeRange}
            isAve={isAve}
            aveIndex={aveIndex}
            remainingMins={remainingMins}
            estimatedMins={estimatedMins}
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

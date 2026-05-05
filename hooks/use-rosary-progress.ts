"use client";

import { useCallback, useEffect, useState } from "react";

import type { MysteryKey } from "@/config/rosary";
import {
  getProgressStorageKey,
  LAST_MYSTERY_KEY,
  ROSARY_STEPS,
  type RosaryStep,
} from "@/player/rosary-steps";

const readStoredStep = (mysteryKey: MysteryKey): number => {
  const storedValue = window.localStorage.getItem(
    getProgressStorageKey(mysteryKey)
  );

  const parsedValue = storedValue ? Number(storedValue) : 0;

  if (!Number.isFinite(parsedValue)) return 0;

  return Math.max(0, Math.min(parsedValue, ROSARY_STEPS.length - 1));
};

export const useRosaryProgress = (mysteryKey: MysteryKey) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasHydratedFromStorage, setHasHydratedFromStorage] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentStepIndex(readStoredStep(mysteryKey));
      setHasHydratedFromStorage(true);
      window.localStorage.setItem(LAST_MYSTERY_KEY, mysteryKey);
    });
  }, [mysteryKey]);

  useEffect(() => {
    if (!hasHydratedFromStorage) return;

    window.localStorage.setItem(
      getProgressStorageKey(mysteryKey),
      String(currentStepIndex)
    );
  }, [currentStepIndex, mysteryKey, hasHydratedFromStorage]);

  const goNext = useCallback(() => {
    setCurrentStepIndex((current) =>
      Math.min(current + 1, ROSARY_STEPS.length - 1)
    );
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  const jumpTo = useCallback((index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, ROSARY_STEPS.length - 1)));
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentStepIndex(0);
    window.localStorage.setItem(getProgressStorageKey(mysteryKey), "0");
  }, [mysteryKey]);

  const currentStep: RosaryStep = ROSARY_STEPS[currentStepIndex];

  return {
    currentStep,
    currentStepIndex,
    steps: ROSARY_STEPS,
    canGoNext: currentStepIndex < ROSARY_STEPS.length - 1,
    canGoPrev: currentStepIndex > 0,
    isProgressHydrated: hasHydratedFromStorage,
    goNext,
    goPrev,
    jumpTo,
    resetProgress,
    progressPercent: ((currentStepIndex + 1) / ROSARY_STEPS.length) * 100,
  };
};

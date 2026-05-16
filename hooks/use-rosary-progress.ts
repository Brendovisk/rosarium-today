"use client";

import { useCallback, useEffect, useState } from "react";

import type { MysteryKey } from "@/config/rosary";
import {
  getProgressStorageKey,
  LAST_MYSTERY_KEY,
  ROSARY_STEPS,
  type RosaryStep,
} from "@/config/rosary";

const readStoredStep = (mysteryKey: MysteryKey, stepsLength: number): number => {
  const storedValue = window.localStorage.getItem(
    getProgressStorageKey(mysteryKey)
  );

  const parsedValue = storedValue ? Number(storedValue) : 0;

  if (!Number.isFinite(parsedValue)) return 0;

  return Math.max(0, Math.min(parsedValue, stepsLength - 1));
};

export const useRosaryProgress = (
  mysteryKey: MysteryKey,
  customSteps?: readonly RosaryStep[],
  skipProgress?: boolean,
) => {
  const steps = customSteps ?? ROSARY_STEPS;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasHydratedFromStorage, setHasHydratedFromStorage] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentStepIndex(
        skipProgress ? 0 : readStoredStep(mysteryKey, steps.length)
      );
      setHasHydratedFromStorage(true);
      window.localStorage.setItem(LAST_MYSTERY_KEY, mysteryKey);
    });
   
  }, [mysteryKey, steps.length, skipProgress]);

  useEffect(() => {
    if (!hasHydratedFromStorage || skipProgress) return;

    window.localStorage.setItem(
      getProgressStorageKey(mysteryKey),
      String(currentStepIndex)
    );
  }, [currentStepIndex, mysteryKey, hasHydratedFromStorage, skipProgress]);

  const goNext = useCallback(() => {
    setCurrentStepIndex((current) =>
      Math.min(current + 1, steps.length - 1)
    );
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setCurrentStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  const jumpTo = useCallback((index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  }, [steps.length]);

  const resetProgress = useCallback(() => {
    setCurrentStepIndex(0);
    if (!skipProgress) {
      window.localStorage.setItem(getProgressStorageKey(mysteryKey), "0");
    }
  }, [mysteryKey, skipProgress]);

  const currentStep: RosaryStep = steps[currentStepIndex];

  return {
    currentStep,
    currentStepIndex,
    steps,
    canGoNext: currentStepIndex < steps.length - 1,
    canGoPrev: currentStepIndex > 0,
    isProgressHydrated: hasHydratedFromStorage,
    goNext,
    goPrev,
    jumpTo,
    resetProgress,
    progressPercent: ((currentStepIndex + 1) / steps.length) * 100,
  };
};

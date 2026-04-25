"use client";

import { useCallback, useEffect, useState } from "react";

import type { MysteryKey } from "@/config/rosary";
import {
  getProgressStorageKey,
  ROSARY_STEPS,
  type RosaryStep,
} from "@/player/rosary-steps";

function readStoredStep(mysteryKey: MysteryKey) {
  const storedValue = window.localStorage.getItem(
    getProgressStorageKey(mysteryKey)
  );
  const parsedValue = storedValue ? Number(storedValue) : 0;

  if (!Number.isFinite(parsedValue)) return 0;

  return Math.max(0, Math.min(parsedValue, ROSARY_STEPS.length - 1));
}

export function useRosaryProgress(mysteryKey: MysteryKey) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Guards the write effect: without this, every mount would overwrite stored
  // progress with 0 before the read effect has had a chance to restore it.
  const [hasHydratedFromStorage, setHasHydratedFromStorage] = useState(false);

  // Restore saved progress on mount. queueMicrotask satisfies the
  // react-hooks/set-state-in-effect lint rule while still running before paint.
  useEffect(() => {
    queueMicrotask(() => {
      setCurrentStepIndex(readStoredStep(mysteryKey));
      setHasHydratedFromStorage(true);
    });
  }, [mysteryKey]);

  // Persist progress changes, but only after hydration to avoid the race above.
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
    progressPercent: ((currentStepIndex + 1) / ROSARY_STEPS.length) * 100,
  };
}

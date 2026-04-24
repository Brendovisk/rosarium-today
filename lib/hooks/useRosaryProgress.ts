'use client'

import { useState, useCallback, useEffect } from 'react'
import { ROSARY_STEPS } from '@/lib/rosary'
import type { MysteryKey, RosaryStep } from '@/lib/rosary'
import { loadProgress, saveProgress } from '@/lib/storage'

interface UseRosaryProgressParams {
  mysteryKey: MysteryKey
  initialStepIndex?: number
  onComplete?: () => void
}

export interface UseRosaryProgressReturn {
  currentStepIndex: number
  currentStep: RosaryStep
  steps: readonly RosaryStep[]
  canGoNext: boolean
  canGoPrev: boolean
  goNext: () => void
  goPrev: () => void
  jumpTo: (index: number) => void
  isComplete: boolean
  progressFraction: number
}

export function useRosaryProgress({
  mysteryKey,
  initialStepIndex,
  onComplete,
}: UseRosaryProgressParams): UseRosaryProgressReturn {
  const steps = ROSARY_STEPS
  const totalSteps = steps.length

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (initialStepIndex !== undefined) return Math.min(initialStepIndex, totalSteps - 1)
    if (typeof window !== 'undefined') {
      const persisted = loadProgress()
      return Math.min(persisted[mysteryKey] ?? 0, totalSteps - 1)
    }
    return 0
  })

  // Persist on every change
  useEffect(() => {
    saveProgress(mysteryKey, currentStepIndex)
  }, [mysteryKey, currentStepIndex])

  const goNext = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = Math.min(prev + 1, totalSteps - 1)
      if (next === totalSteps - 1 && prev !== totalSteps - 1) {
        onComplete?.()
      }
      return next
    })
  }, [totalSteps, onComplete])

  const goPrev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const jumpTo = useCallback(
    (index: number) => {
      setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)))
    },
    [totalSteps],
  )

  const currentStep = steps[currentStepIndex]

  return {
    currentStepIndex,
    currentStep,
    steps,
    canGoNext: currentStepIndex < totalSteps - 1,
    canGoPrev: currentStepIndex > 0,
    goNext,
    goPrev,
    jumpTo,
    isComplete: currentStepIndex === totalSteps - 1,
    progressFraction: currentStepIndex / (totalSteps - 1),
  }
}

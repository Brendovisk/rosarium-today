import { MysteryList } from '@/components/organisms/MysteryList'
import { BeadProgress } from '@/components/molecules/BeadProgress'
import type { MysteryKey, RosaryStep } from '@/lib/rosary'

function formatRemainingTime(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  return `${minutes}m`
}

interface RosarySidebarProps {
  mysteryKey: MysteryKey
  mysteryName: string
  decades: readonly string[]
  currentDecadeIndex: number
  steps: readonly RosaryStep[]
  currentStepIndex: number
  remainingSeconds: number
  remainingLabel: string
  stepLabel: string
  stepOf: string
}

export function RosarySidebar({
  mysteryName,
  decades,
  currentDecadeIndex,
  steps,
  currentStepIndex,
  remainingSeconds,
  remainingLabel,
  stepLabel,
  stepOf,
}: RosarySidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l border-[rgba(198,161,91,0.06)] bg-[#0D0C0A] px-5 py-6">
      {/* Progress stats */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#3A3530]">
          {currentStepIndex + 1} {stepOf} {steps.length}
        </span>
        {remainingSeconds > 0 && (
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#3A3530]">
            {remainingLabel}: {formatRemainingTime(remainingSeconds)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-px w-full bg-[#1A1610] relative overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[rgba(198,161,91,0.6)] to-[rgba(198,161,91,0.3)] transition-all duration-700"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Mystery list */}
      <MysteryList
        mysteryName={mysteryName}
        decades={decades}
        currentDecadeIndex={currentDecadeIndex}
      />

      {/* Bead dots */}
      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] uppercase text-[#3A3530]">{stepLabel}</p>
        <BeadProgress steps={steps} currentIndex={currentStepIndex} />
      </div>
    </aside>
  )
}

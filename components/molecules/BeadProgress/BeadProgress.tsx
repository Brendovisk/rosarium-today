import { BeadDot } from '@/components/atoms/BeadDot'
import type { RosaryStep } from '@/lib/rosary'

interface BeadProgressProps {
  steps: readonly RosaryStep[]
  currentIndex: number
}

export function BeadProgress({ steps, currentIndex }: BeadProgressProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      {steps.map((step, index) => {
        const state =
          index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'upcoming'
        return (
          <BeadDot key={step.globalIndex} state={state} prayerKey={step.prayerKey ?? undefined} />
        )
      })}
    </div>
  )
}

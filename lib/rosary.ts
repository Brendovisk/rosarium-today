import type { PrayerKey } from './prayers'

export type MysteryKey = 'joyful' | 'sorrowful' | 'glorious' | 'luminous'

export type RosaryStepType =
  | 'opening'
  | 'mystery-announcement'
  | 'decade'
  | 'closing'

export interface RosaryStep {
  readonly globalIndex: number
  readonly prayerKey: PrayerKey | null
  readonly type: RosaryStepType
  readonly label: string
  readonly decadeIndex: number | null
  readonly aveIndex: number | null
  readonly mysteryDecadeIndex: number | null
}

const OPENING_STEPS: ReadonlyArray<Pick<RosaryStep, 'prayerKey' | 'label'>> = [
  { prayerKey: 'signum-crucis', label: 'signumCrucis' },
  { prayerKey: 'symbolum-apostolorum', label: 'symbolumApostolorum' },
  { prayerKey: 'pater-noster', label: 'paterNoster' },
  { prayerKey: 'ave-maria', label: 'avePro.fide' },
  { prayerKey: 'ave-maria', label: 'avePro.spe' },
  { prayerKey: 'ave-maria', label: 'avePro.caritate' },
  { prayerKey: 'gloria-patri', label: 'gloriaPatri' },
]

const CLOSING_STEPS: ReadonlyArray<Pick<RosaryStep, 'prayerKey' | 'label'>> = [
  { prayerKey: 'salve-regina', label: 'salveRegina' },
  { prayerKey: 'intercessio-mariae', label: 'intercessio' },
]

export function buildRosarySteps(): RosaryStep[] {
  const steps: RosaryStep[] = []

  // Opening sequence (7 steps)
  OPENING_STEPS.forEach((entry, idx) => {
    steps.push({
      globalIndex: idx,
      prayerKey: entry.prayerKey,
      type: 'opening',
      label: entry.label,
      decadeIndex: null,
      aveIndex: null,
      mysteryDecadeIndex: null,
    })
  })

  // 5 decades × 14 steps each (70 steps)
  for (let decadeIndex = 0; decadeIndex < 5; decadeIndex++) {
    const decadeBase = OPENING_STEPS.length + decadeIndex * 14

    // Mystery announcement (step 0 of decade)
    steps.push({
      globalIndex: decadeBase,
      prayerKey: null,
      type: 'mystery-announcement',
      label: 'mysteryAnnouncement',
      decadeIndex,
      aveIndex: null,
      mysteryDecadeIndex: decadeIndex,
    })

    // Pater Noster (step 1 of decade)
    steps.push({
      globalIndex: decadeBase + 1,
      prayerKey: 'pater-noster',
      type: 'decade',
      label: 'paterNoster',
      decadeIndex,
      aveIndex: null,
      mysteryDecadeIndex: decadeIndex,
    })

    // 10× Ave Maria (steps 2–11)
    for (let aveIndex = 0; aveIndex < 10; aveIndex++) {
      steps.push({
        globalIndex: decadeBase + 2 + aveIndex,
        prayerKey: 'ave-maria',
        type: 'decade',
        label: 'aveMaria',
        decadeIndex,
        aveIndex,
        mysteryDecadeIndex: decadeIndex,
      })
    }

    // Gloria Patri (step 12 of decade)
    steps.push({
      globalIndex: decadeBase + 12,
      prayerKey: 'gloria-patri',
      type: 'decade',
      label: 'gloriaPatri',
      decadeIndex,
      aveIndex: null,
      mysteryDecadeIndex: decadeIndex,
    })

    // Oratio Fatima (step 13 of decade)
    steps.push({
      globalIndex: decadeBase + 13,
      prayerKey: 'oratio-fatima',
      type: 'decade',
      label: 'oratio',
      decadeIndex,
      aveIndex: null,
      mysteryDecadeIndex: decadeIndex,
    })
  }

  // Closing (2 steps)
  const closingBase = OPENING_STEPS.length + 70
  CLOSING_STEPS.forEach((entry, idx) => {
    steps.push({
      globalIndex: closingBase + idx,
      prayerKey: entry.prayerKey,
      type: 'closing',
      label: entry.label,
      decadeIndex: null,
      aveIndex: null,
      mysteryDecadeIndex: null,
    })
  })

  return steps
}

export const ROSARY_STEPS: readonly RosaryStep[] = buildRosarySteps()

// day 0 = Sunday
const MYSTERY_BY_DAY: Readonly<Record<number, MysteryKey>> = {
  0: 'glorious',
  1: 'joyful',
  2: 'sorrowful',
  3: 'glorious',
  4: 'luminous',
  5: 'sorrowful',
  6: 'joyful',
}

export function getTodaysMystery(): MysteryKey {
  const day = new Date().getDay()
  return MYSTERY_BY_DAY[day]
}

export const MYSTERIES: readonly MysteryKey[] = [
  'joyful',
  'sorrowful',
  'glorious',
  'luminous',
]

export function isMysteryKey(value: string): value is MysteryKey {
  return MYSTERIES.includes(value as MysteryKey)
}

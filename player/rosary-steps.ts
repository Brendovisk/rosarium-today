import type { MysteryKey } from "@/config/rosary";
import type { PrayerKey } from "@/player/assets";

export type RosaryStepType =
  | "opening"
  | "mystery-announcement"
  | "decade"
  | "closing";

export type RosaryStep = {
  readonly prayerKey: PrayerKey | null;
  readonly type: RosaryStepType;
  readonly label: string;
  readonly decadeIndex: number | null;
  readonly aveIndex: number | null;
};

export const DECADES_PER_ROSARY = 5;
export const AVE_MARIAS_PER_DECADE = 10;

export const REFLECTION_DURATION_MS = 10_000;
export const ESTIMATED_ROSARY_DURATION_MINS = 22;

const OPENING_STEPS: ReadonlyArray<Pick<RosaryStep, "prayerKey" | "label">> = [
  { prayerKey: "signum-crucis", label: "signumCrucis" },
  { prayerKey: "symbolum-apostolorum", label: "symbolumApostolorum" },
  { prayerKey: "pater-noster", label: "paterNoster" },
  { prayerKey: "ave-maria", label: "avePro.fide" },
  { prayerKey: "ave-maria", label: "avePro.spe" },
  { prayerKey: "ave-maria", label: "avePro.caritate" },
  { prayerKey: "gloria-patri", label: "gloriaPatri" },
];

const CLOSING_STEPS: ReadonlyArray<Pick<RosaryStep, "prayerKey" | "label">> = [
  { prayerKey: "salve-regina", label: "salveRegina" },
  { prayerKey: "signum-crucis", label: "signumCrucis" },
];

function buildRosarySteps(includeClosing = true, includeOpening = true): RosaryStep[] {
  const steps: RosaryStep[] = [];

  if (includeOpening) {
    for (const entry of OPENING_STEPS) {
      steps.push({
        prayerKey: entry.prayerKey,
        type: "opening",
        label: entry.label,
        decadeIndex: null,
        aveIndex: null,
      });
    }
  }

  for (let decadeIndex = 0; decadeIndex < DECADES_PER_ROSARY; decadeIndex++) {
    steps.push({
      prayerKey: null,
      type: "mystery-announcement",
      label: "mysteryAnnouncement",
      decadeIndex,
      aveIndex: null,
    });

    steps.push({
      prayerKey: "pater-noster",
      type: "decade",
      label: "paterNoster",
      decadeIndex,
      aveIndex: null,
    });

    for (let aveIndex = 0; aveIndex < AVE_MARIAS_PER_DECADE; aveIndex++) {
      steps.push({
        prayerKey: "ave-maria",
        type: "decade",
        label: "aveMaria",
        decadeIndex,
        aveIndex,
      });
    }

    steps.push({
      prayerKey: "gloria-patri",
      type: "decade",
      label: "gloriaPatri",
      decadeIndex,
      aveIndex: null,
    });

    steps.push({
      prayerKey: "oratio-fatima",
      type: "decade",
      label: "oratio",
      decadeIndex,
      aveIndex: null,
    });

    steps.push({
      prayerKey: "miraculous-medal",
      type: "decade",
      label: "miraculousMedal",
      decadeIndex,
      aveIndex: null,
    });
  }

  if (includeClosing) {
    for (const entry of CLOSING_STEPS) {
      steps.push({
        prayerKey: entry.prayerKey,
        type: "closing",
        label: entry.label,
        decadeIndex: null,
        aveIndex: null,
      });
    }
  }

  return steps;
}

export const ROSARY_STEPS: readonly RosaryStep[] = buildRosarySteps(true, true);
export const ROSARY_STEPS_NO_CLOSING: readonly RosaryStep[] = buildRosarySteps(false, true);
export const ROSARY_STEPS_DECADES_ONLY: readonly RosaryStep[] = buildRosarySteps(false, false);
export const ROSARY_STEPS_NO_OPENING: readonly RosaryStep[] = buildRosarySteps(true, false);

function prayerStepCount(steps: readonly RosaryStep[]): number {
  return steps.filter((s) => s.type !== "mystery-announcement").length;
}

// Prayer step counts by position in the full rosary (0=joyful…3=glorious)
const FULL_ROSARY_PS_BY_POS = [
  prayerStepCount(ROSARY_STEPS_NO_CLOSING),   // 0: has opening, no closing
  prayerStepCount(ROSARY_STEPS_DECADES_ONLY), // 1: no opening, no closing
  prayerStepCount(ROSARY_STEPS_DECADES_ONLY), // 2: no opening, no closing
  prayerStepCount(ROSARY_STEPS_NO_OPENING),   // 3: no opening, has closing
] as const;

// Cumulative offsets so displayPrayerCurrent = offset[i] + prayerCurrent
export const FULL_ROSARY_PRAYER_STEP_OFFSETS: readonly number[] =
  FULL_ROSARY_PS_BY_POS.reduce((acc: number[], _count, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + FULL_ROSARY_PS_BY_POS[i - 1]);
    return acc;
  }, []);

export const FULL_ROSARY_PRAYER_STEPS = FULL_ROSARY_PS_BY_POS.reduce(
  (sum, n) => sum + n,
  0
);

export function getProgressStorageKey(mysteryKey: MysteryKey) {
  return `rosarium:progress:${mysteryKey}`;
}

export const LAST_MYSTERY_KEY = "rosarium:last-mystery";

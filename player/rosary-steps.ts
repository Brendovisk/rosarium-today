import type { MysteryKey } from "@/config/rosary";
import type { PrayerKey } from "@/player/assets";

export type RosaryStepType =
  | "opening"
  | "mystery-announcement"
  | "decade"
  | "closing";

export interface RosaryStep {
  readonly prayerKey: PrayerKey | null;
  readonly type: RosaryStepType;
  readonly label: string;
  readonly decadeIndex: number | null;
  readonly aveIndex: number | null;
}

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

function buildRosarySteps(): RosaryStep[] {
  const steps: RosaryStep[] = [];

  for (const entry of OPENING_STEPS) {
    steps.push({
      prayerKey: entry.prayerKey,
      type: "opening",
      label: entry.label,
      decadeIndex: null,
      aveIndex: null,
    });
  }

  for (let decadeIndex = 0; decadeIndex < DECADES_PER_ROSARY; decadeIndex++) {
    // prayerKey: null — mystery announcements show a silent reflection UI,
    // not an audio prayer.
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
  }

  for (const entry of CLOSING_STEPS) {
    steps.push({
      prayerKey: entry.prayerKey,
      type: "closing",
      label: entry.label,
      decadeIndex: null,
      aveIndex: null,
    });
  }

  return steps;
}

// Mystery-agnostic: the same 79-step sequence is reused for all four mystery
// types. Mystery names and decade titles come from i18n at render time.
export const ROSARY_STEPS: readonly RosaryStep[] = buildRosarySteps();

export function getProgressStorageKey(mysteryKey: MysteryKey) {
  return `rosarium:progress:${mysteryKey}`;
}

export const LAST_MYSTERY_KEY = "rosarium:last-mystery";

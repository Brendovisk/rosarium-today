export type MysteryKey = "joyful" | "sorrowful" | "glorious" | "luminous";

export const MYSTERIES: readonly MysteryKey[] = [
  "joyful",
  "sorrowful",
  "glorious",
  "luminous",
];

export const MYSTERY_GRADIENTS: Record<MysteryKey, string> = {
  joyful:
    "linear-gradient(135deg, rgba(198,161,91,0.22) 0%, rgba(146,64,14,0.12) 100%)",
  luminous:
    "linear-gradient(135deg, rgba(217,119,6,0.14) 0%, rgba(120,53,15,0.10) 100%)",
  sorrowful:
    "linear-gradient(135deg, rgba(122,46,47,0.25) 0%, rgba(75,62,50,0.16) 100%)",
  glorious:
    "linear-gradient(135deg, rgba(198,161,91,0.26) 0%, rgba(167,111,38,0.12) 100%)",
};

const MYSTERY_BY_DAY: Readonly<Record<number, MysteryKey>> = {
  0: "glorious",
  1: "joyful",
  2: "sorrowful",
  3: "glorious",
  4: "luminous",
  5: "sorrowful",
  6: "joyful",
};

export function getTodaysMystery(): MysteryKey {
  return MYSTERY_BY_DAY[new Date().getDay()];
}

export function isMysteryKey(value: string): value is MysteryKey {
  return MYSTERIES.includes(value as MysteryKey);
}

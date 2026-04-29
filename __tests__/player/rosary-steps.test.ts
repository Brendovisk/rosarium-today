import {
  AVE_MARIAS_PER_DECADE,
  DECADES_PER_ROSARY,
  getProgressStorageKey,
  LAST_MYSTERY_KEY,
  ROSARY_STEPS,
} from "@/player/rosary-steps";

describe("ROSARY_STEPS", () => {
  // 7 opening + 5 × (1 announcement + 1 paterNoster + 10 aveMaria + 1 gloria + 1 oratio) + 1 closing
  const EXPECTED_TOTAL =
    7 + DECADES_PER_ROSARY * (1 + 1 + AVE_MARIAS_PER_DECADE + 1 + 1) + 1;

  it("has correct total step count", () => {
    expect(ROSARY_STEPS.length).toBe(EXPECTED_TOTAL);
  });

  it("has exactly 5 mystery announcements", () => {
    const announcements = ROSARY_STEPS.filter(
      (s) => s.type === "mystery-announcement"
    );
    expect(announcements).toHaveLength(DECADES_PER_ROSARY);
  });

  it("mystery announcements have null prayerKey", () => {
    ROSARY_STEPS.filter((s) => s.type === "mystery-announcement").forEach(
      (s) => expect(s.prayerKey).toBeNull()
    );
  });

  it("each decade has exactly 10 Ave Marias", () => {
    for (let d = 0; d < DECADES_PER_ROSARY; d++) {
      const aves = ROSARY_STEPS.filter(
        (s) => s.decadeIndex === d && s.label === "aveMaria"
      );
      expect(aves).toHaveLength(AVE_MARIAS_PER_DECADE);
    }
  });

  it("Ave Maria aveIndex values are sequential 0–9 per decade", () => {
    for (let d = 0; d < DECADES_PER_ROSARY; d++) {
      const aves = ROSARY_STEPS.filter(
        (s) => s.decadeIndex === d && s.label === "aveMaria"
      );
      aves.forEach((s, i) => expect(s.aveIndex).toBe(i));
    }
  });

  it("opening steps have null decadeIndex and null aveIndex", () => {
    ROSARY_STEPS.filter((s) => s.type === "opening").forEach((s) => {
      expect(s.decadeIndex).toBeNull();
      expect(s.aveIndex).toBeNull();
    });
  });

  it("closing steps have null decadeIndex", () => {
    ROSARY_STEPS.filter((s) => s.type === "closing").forEach((s) =>
      expect(s.decadeIndex).toBeNull()
    );
  });
});

describe("getProgressStorageKey", () => {
  it("returns distinct keys per mystery", () => {
    const keys = [
      getProgressStorageKey("joyful"),
      getProgressStorageKey("sorrowful"),
      getProgressStorageKey("glorious"),
      getProgressStorageKey("luminous"),
    ];
    expect(new Set(keys).size).toBe(4);
  });

  it("key contains mystery name", () => {
    expect(getProgressStorageKey("joyful")).toContain("joyful");
  });
});

describe("LAST_MYSTERY_KEY", () => {
  it("is a non-empty string", () => {
    expect(typeof LAST_MYSTERY_KEY).toBe("string");
    expect(LAST_MYSTERY_KEY.length).toBeGreaterThan(0);
  });
});

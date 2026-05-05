import {
  getStepArtwork,
  getTodaysMystery,
  isMysteryKey,
  MYSTERIES,
  MYSTERY_ARTWORKS,
} from "@/config/rosary";

describe("isMysteryKey", () => {
  it("accepts all defined mysteries", () => {
    MYSTERIES.forEach((m) => expect(isMysteryKey(m)).toBe(true));
  });

  it("rejects unknown strings", () => {
    expect(isMysteryKey("glorious2")).toBe(false);
    expect(isMysteryKey("")).toBe(false);
    expect(isMysteryKey("Joyful")).toBe(false);
  });
});

describe("getTodaysMystery", () => {
  const DAY_MAP: Record<number, string> = {
    0: "glorious",
    1: "joyful",
    2: "sorrowful",
    3: "glorious",
    4: "luminous",
    5: "sorrowful",
    6: "joyful",
  };

  it("returns the correct mystery for each day of the week", () => {
    const spy = jest.spyOn(Date.prototype, "getDay");
    for (const [day, expected] of Object.entries(DAY_MAP)) {
      spy.mockReturnValue(Number(day));
      expect(getTodaysMystery()).toBe(expected);
    }
    spy.mockRestore();
  });
});

describe("getStepArtwork", () => {
  it("returns null for gloria and oratio decade steps", () => {
    expect(
      getStepArtwork("joyful", { type: "decade", label: "gloriaPatri", decadeIndex: 0 })
    ).toBeNull();
    expect(
      getStepArtwork("joyful", { type: "decade", label: "oratio", decadeIndex: 0 })
    ).toBeNull();
  });

  it("returns artwork for decade steps other than gloria/oratio", () => {
    const art = getStepArtwork("joyful", {
      type: "decade",
      label: "aveMaria",
      decadeIndex: 0,
    });
    expect(art).not.toBeNull();
    expect(art?.src).toBeTruthy();
  });

  it("wraps artwork index for each mystery (5 artworks, 5 decades)", () => {
    for (const mystery of MYSTERIES) {
      for (let d = 0; d < 5; d++) {
        const art = getStepArtwork(mystery, {
          type: "decade",
          label: "aveMaria",
          decadeIndex: d,
        });
        expect(art).toEqual(MYSTERY_ARTWORKS[mystery][d % MYSTERY_ARTWORKS[mystery].length]);
      }
    }
  });

  it("returns null for opening steps with unknown label", () => {
    expect(
      getStepArtwork("joyful", { type: "opening", label: "unknown", decadeIndex: null })
    ).toBeNull();
  });

  it("returns artwork for known opening labels", () => {
    const art = getStepArtwork("joyful", {
      type: "opening",
      label: "symbolumApostolorum",
      decadeIndex: null,
    });
    expect(art).not.toBeNull();
  });

  it("returns null for closing steps with unknown label", () => {
    expect(
      getStepArtwork("joyful", { type: "closing", label: "salveRegina", decadeIndex: null })
    ).not.toBeNull();
  });
});

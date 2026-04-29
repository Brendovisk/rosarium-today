import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  parseSettingsCookie,
  serializeSettingsCookie,
} from "@/config/settings";

describe("normalizeSettings", () => {
  it("returns defaults for null/undefined/non-object", () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings("string")).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(42)).toEqual(DEFAULT_SETTINGS);
  });

  it("accepts valid partial values and fills rest with defaults", () => {
    const result = normalizeSettings({ theme: "light", accent: "wine" });
    expect(result.theme).toBe("light");
    expect(result.accent).toBe("wine");
    expect(result.uiLanguage).toBe(DEFAULT_SETTINGS.uiLanguage);
    expect(result.binauralEnabled).toBe(DEFAULT_SETTINGS.binauralEnabled);
    expect(result.artworkEnabled).toBe(DEFAULT_SETTINGS.artworkEnabled);
  });

  it("rejects invalid theme value", () => {
    expect(normalizeSettings({ theme: "neon" }).theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it("rejects invalid accent", () => {
    expect(normalizeSettings({ accent: "rainbow" }).accent).toBe(DEFAULT_SETTINGS.accent);
  });

  it("rejects binauralVolume out of [0, 1] range", () => {
    expect(normalizeSettings({ binauralVolume: -1 }).binauralVolume).toBe(
      DEFAULT_SETTINGS.binauralVolume
    );
    expect(normalizeSettings({ binauralVolume: 1.5 }).binauralVolume).toBe(
      DEFAULT_SETTINGS.binauralVolume
    );
  });

  it("accepts binauralVolume within [0, 1]", () => {
    expect(normalizeSettings({ binauralVolume: 0 }).binauralVolume).toBe(0);
    expect(normalizeSettings({ binauralVolume: 1 }).binauralVolume).toBe(1);
    expect(normalizeSettings({ binauralVolume: 0.5 }).binauralVolume).toBe(0.5);
  });

  it("accepts boolean flags", () => {
    expect(normalizeSettings({ binauralEnabled: true }).binauralEnabled).toBe(true);
    expect(normalizeSettings({ artworkEnabled: true }).artworkEnabled).toBe(true);
  });
});

describe("parseSettingsCookie", () => {
  it("returns defaults for empty/null/undefined cookie", () => {
    expect(parseSettingsCookie(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettingsCookie("")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettingsCookie(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it("returns defaults for malformed JSON", () => {
    expect(parseSettingsCookie("not-json")).toEqual(DEFAULT_SETTINGS);
  });

  it("round-trips through serialize then parse", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      theme: "light" as const,
      accent: "moss" as const,
      binauralEnabled: true,
      binauralVolume: 0.6,
      artworkEnabled: true,
    };
    const cookie = serializeSettingsCookie(settings);
    expect(parseSettingsCookie(cookie)).toEqual(settings);
  });
});

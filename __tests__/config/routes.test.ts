import { SUPPORTED_LOCALES } from "@/config/locales";
import type { MysteryKey } from "@/config/rosary";
import {
  getCanonicalPath,
  getLocalizedPath,
  getLocalizedPrayerPath,
  MYSTERY_SLUGS,
  PRAYER_SEGMENT,
  PRIVACY_SEGMENT,
  TERMS_SEGMENT,
} from "@/config/routes";

const MYSTERIES: MysteryKey[] = ["joyful", "sorrowful", "glorious", "luminous"];

describe("getLocalizedPrayerPath", () => {
  it("returns /prayer/<slug> for en", () => {
    expect(getLocalizedPrayerPath("joyful", "en")).toBe("/prayer/joyful");
    expect(getLocalizedPrayerPath("sorrowful", "en")).toBe("/prayer/sorrowful");
  });

  it("returns localized segment for pt-br", () => {
    expect(getLocalizedPrayerPath("joyful", "pt-br")).toBe("/oracao/gozosos");
    expect(getLocalizedPrayerPath("sorrowful", "pt-br")).toBe("/oracao/dolorosos");
  });

  it("returns localized segment for la", () => {
    expect(getLocalizedPrayerPath("joyful", "la")).toBe("/oratio/gaudiosa");
    expect(getLocalizedPrayerPath("luminous", "la")).toBe("/oratio/luminosa");
  });

  it("covers all mysteries × all locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const mystery of MYSTERIES) {
        const path = getLocalizedPrayerPath(mystery, locale);
        expect(path).toMatch(/^\//);
        expect(path).toContain(MYSTERY_SLUGS[locale][mystery]);
      }
    }
  });
});

describe("getLocalizedPath — prayer routes", () => {
  it("localizes canonical prayer paths", () => {
    expect(getLocalizedPath("/prayer/joyful", "pt-br")).toBe("/oracao/gozosos");
    expect(getLocalizedPath("/prayer/luminous", "la")).toBe("/oratio/luminosa");
  });

  it("preserves trailing path segments", () => {
    expect(getLocalizedPath("/prayer/joyful/step/3", "pt-br")).toBe(
      "/oracao/gozosos/step/3"
    );
  });

  it("returns canonical path unchanged for en prayer routes", () => {
    expect(getLocalizedPath("/prayer/joyful", "en")).toBe("/prayer/joyful");
  });
});

describe("getLocalizedPath — static routes", () => {
  it("localizes /privacy for each locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const path = getLocalizedPath("/privacy", locale);
      expect(path).toBe(`/${PRIVACY_SEGMENT[locale]}`);
    }
  });

  it("localizes /terms for each locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const path = getLocalizedPath("/terms", locale);
      expect(path).toBe(`/${TERMS_SEGMENT[locale]}`);
    }
  });

  it("returns unknown paths unchanged", () => {
    expect(getLocalizedPath("/about", "pt-br")).toBe("/about");
    expect(getLocalizedPath("/", "la")).toBe("/");
  });
});

describe("getCanonicalPath", () => {
  it("resolves localized prayer paths to canonical", () => {
    expect(getCanonicalPath("/oracao/gozosos")).toBe("/prayer/joyful");
    expect(getCanonicalPath("/oratio/gaudiosa")).toBe("/prayer/joyful");
    expect(getCanonicalPath("/prayer/joyful")).toBe("/prayer/joyful");
  });

  it("resolves all mystery slugs across all locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const mystery of MYSTERIES) {
        const localized = `/${PRAYER_SEGMENT[locale]}/${MYSTERY_SLUGS[locale][mystery]}`;
        expect(getCanonicalPath(localized)).toBe(`/prayer/${mystery}`);
      }
    }
  });

  it("resolves localized privacy paths", () => {
    expect(getCanonicalPath("/privacidade")).toBe("/privacy");
    expect(getCanonicalPath("/privata")).toBe("/privacy");
    expect(getCanonicalPath("/privacy")).toBe("/privacy");
  });

  it("resolves localized terms paths", () => {
    expect(getCanonicalPath("/termos")).toBe("/terms");
    expect(getCanonicalPath("/termini")).toBe("/terms");
    expect(getCanonicalPath("/terms")).toBe("/terms");
  });

  it("returns unknown paths unchanged", () => {
    expect(getCanonicalPath("/about")).toBe("/about");
    expect(getCanonicalPath("/")).toBe("/");
  });
});

import { isSupportedLocale, SUPPORTED_LOCALES } from "@/config/locales";

describe("isSupportedLocale", () => {
  it("accepts all defined locales", () => {
    SUPPORTED_LOCALES.forEach((locale) => {
      expect(isSupportedLocale(locale)).toBe(true);
    });
  });

  it("rejects unknown locale strings", () => {
    expect(isSupportedLocale("fr")).toBe(false);
    expect(isSupportedLocale("es")).toBe(false);
    expect(isSupportedLocale("")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isSupportedLocale(null)).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
    expect(isSupportedLocale(42)).toBe(false);
  });
});

describe("SUPPORTED_LOCALES", () => {
  it("includes en, pt-br, and la", () => {
    expect(SUPPORTED_LOCALES).toContain("en");
    expect(SUPPORTED_LOCALES).toContain("pt-br");
    expect(SUPPORTED_LOCALES).toContain("la");
  });
});

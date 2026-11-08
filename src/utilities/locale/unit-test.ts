import { describe, expect, it } from "vitest";
import { isLocale, languageTag, LOCALES, openGraphLocale } from ".";

describe("locale", () => {
  it("accepts only published locales", () => {
    expect(LOCALES.every(isLocale)).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
  it("maps to language and Open Graph tags", () => {
    expect(languageTag("pt")).toBe("pt-PT");
    expect(openGraphLocale("en")).toBe("en_GB");
  });
});

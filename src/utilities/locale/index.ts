import type { Locale } from "./type";

/** Every published locale. The first one is the default (x-default). */
export const LOCALES: readonly Locale[] = ["en", "pt"];

/** Narrows an untrusted route segment to a known locale. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The BCP 47 tag used for `<html lang>` and `inLanguage`. */
export function languageTag(locale: Locale): string {
  return locale === "pt" ? "pt-PT" : "en";
}

/** The Open Graph locale (`og:locale`). */
export function openGraphLocale(locale: Locale): string {
  return locale === "pt" ? "pt_PT" : "en_GB";
}

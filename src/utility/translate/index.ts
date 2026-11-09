import type { Locale, Translated } from "@sharadox/sharadox-web-application/utility/locale/type";

/** Picks the copy for a locale. */
export function translate(value: Translated, locale: Locale): string {
  return value[locale];
}

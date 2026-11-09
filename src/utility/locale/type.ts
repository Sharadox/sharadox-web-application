/** A language the site is published in. */
export type Locale = "en" | "pt";

/** A piece of copy written in every published language. */
export type Translated = Record<Locale, string>;

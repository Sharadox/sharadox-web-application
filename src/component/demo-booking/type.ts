import type { Locale } from "@sharadox/luis-pires-decor-web-library/content/locale/type";

export interface DemoBookingProperties {
  locale: Locale;
  /** What sending says instead: that it's a demo and nothing was sent. */
  demo: string;
}

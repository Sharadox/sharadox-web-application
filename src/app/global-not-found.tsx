import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { StyleScript } from "@sharadox/style-web-library/style-script";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { STYLES } from "@sharadox/sharadox-web-library/content/style";
import { separate } from "@sharadox/sharadox-web-library/utility/separate";
import { NotFoundPage } from "@sharadox/sharadox-web-application/component/not-found-page";
import "@sharadox/sharadox-web-application/style/global/index.scss";

// Addresses no route answers at all (files that don't exist, for example): the same 404, in the default language.
export const metadata: Metadata = { title: separate("404", SITE.name), robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html
      lang={LOCALES.languageTag(LOCALES.defaultLocale)}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <StyleScript configuration={STYLES} />
      </head>
      <body id="top">
        <NotFoundPage />
      </body>
    </html>
  );
}

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { pageMetadata } from "@sharadox/metadata-web-library/page-metadata";
import { LocaleTransitionStyle } from "@sharadox/internationalization-web-library/locale-transition-style";
import { StyleScript } from "@sharadox/style-web-library/style-script";
import { StructuredData } from "@sharadox/sharadox-web-library/component/structured-data";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { SLOGAN } from "@sharadox/sharadox-web-library/content/slogan";
import { STYLES } from "@sharadox/sharadox-web-library/content/style";
import { separate } from "@sharadox/sharadox-web-library/utility/separate";
import "@sharadox/sharadox-web-application/style/global/index.scss";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.staticParams();
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark light",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.isLocale(locale)) return {};
  return pageMetadata({
    name: SITE.name,
    url: SITE.url,
    locales: LOCALES,
    locale,
    title: separate(SITE.name, translate(SLOGAN, locale)),
    titleTemplate: separate("%s", SITE.name),
    description: translate(SITE.description, locale),
    keywords: SITE.keywords[locale],
  });
}

export default async function Layout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!LOCALES.isLocale(locale)) notFound();
  return (
    // The style script sets data-style-* on <html> before React loads, so the attributes differ on purpose.
    <html
      lang={LOCALES.languageTag(locale)}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <StyleScript configuration={STYLES} />
        <LocaleTransitionStyle />
      </head>
      <body id="top">
        <StructuredData locale={locale} />
        {children as ReactNode}
      </body>
    </html>
  );
}

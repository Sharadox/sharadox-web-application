import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { StructuredData } from "@sharadox/sharadox-web-application/component/structured-data";
import { SITE } from "@sharadox/sharadox-web-application/content/site";
import { isLocale, languageTag, LOCALES, openGraphLocale } from "@sharadox/sharadox-web-application/utility/locale";
import { translate } from "@sharadox/sharadox-web-application/utility/translate";
import "@sharadox/sharadox-web-application/style/global/index.scss";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));
export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = `Sharadox — ${translate(SITE.slogan, locale)}`;
  const description = translate(SITE.description, locale);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: "%s · Sharadox" },
    description,
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    keywords: SITE.keywords[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", pt: "/pt", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: SITE.name,
      title,
      description,
      locale: openGraphLocale(locale),
      alternateLocale: LOCALES.filter((other) => other !== locale).map(openGraphLocale),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: false },
  };
}

export default async function Layout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={languageTag(locale)} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body id="top">
        <StructuredData locale={locale} />
        {children as ReactNode}
      </body>
    </html>
  );
}

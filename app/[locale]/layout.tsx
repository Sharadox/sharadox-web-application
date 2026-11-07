import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { notFound } from "next/navigation";
import { LOCALES, SITE, tr, type Locale } from "@/content";
import "../globals.css";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));
export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const l = (await params).locale as Locale;
  const title = `Sharadox — ${tr(SITE.slogan, l)}`;
  const description = tr(SITE.description, l);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: "%s · Sharadox" },
    description,
    applicationName: "Sharadox",
    authors: [{ name: "Sharadox", url: SITE.url }],
    creator: "Sharadox",
    keywords: l === "pt"
      ? ["desenvolvimento web", "websites", "aplicações", "plataformas", "Algarve", "Portugal", "Next.js", "design"]
      : ["web development", "websites", "apps", "platforms", "Algarve", "Portugal", "Next.js", "design studio"],
    alternates: {
      canonical: `/${l}`,
      languages: { en: "/en", pt: "/pt", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      url: `/${l}`,
      siteName: "Sharadox",
      title,
      description,
      locale: l === "pt" ? "pt_PT" : "en_GB",
      alternateLocale: l === "pt" ? ["en_GB"] : ["pt_PT"],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: false },
  };
}

function JsonLd({ l }: { l: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#org`,
        name: "Sharadox",
        url: SITE.url,
        email: SITE.email,
        slogan: tr(SITE.slogan, l),
        description: tr(SITE.description, l),
        logo: `${SITE.url}/icon.svg`,
        address: { "@type": "PostalAddress", addressRegion: "Algarve", addressCountry: "PT" },
        areaServed: "Worldwide",
        knowsAbout: ["Web development", "Web design", "Mobile apps", "Software platforms"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: `${SITE.url}/${l}`,
        name: "Sharadox",
        inLanguage: l === "pt" ? "pt-PT" : "en",
        publisher: { "@id": `${SITE.url}/#org` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  return (
    <html lang={locale === "pt" ? "pt-PT" : "en"} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body id="top">
        <JsonLd l={locale as Locale} />
        {children}
      </body>
    </html>
  );
}

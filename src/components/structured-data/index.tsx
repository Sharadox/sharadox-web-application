import { SITE } from "@/content/site";
import { languageTag } from "@/utilities/locale";
import { translate } from "@/utilities/translate";
import type { StructuredDataProps } from "./type";

/** JSON-LD for search engines: the Sharadox organization and website. */
export function StructuredData({ locale }: StructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#org`,
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        slogan: translate(SITE.slogan, locale),
        description: translate(SITE.description, locale),
        logo: `${SITE.url}/icon.svg`,
        address: { "@type": "PostalAddress", addressRegion: "Algarve", addressCountry: "PT" },
        areaServed: "Worldwide",
        knowsAbout: ["Web development", "Web design", "Mobile apps", "Software platforms"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: `${SITE.url}/${locale}`,
        name: SITE.name,
        inLanguage: languageTag(locale),
        publisher: { "@id": `${SITE.url}/#org` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

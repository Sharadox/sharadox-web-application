import { SITE } from "@sharadox/sharadox-web-application/content/site";
import { languageTag } from "@sharadox/sharadox-web-application/utility/locale";
import { translate } from "@sharadox/sharadox-web-application/utility/translate";
import type { StructuredDataProperties } from "./type";

/** JSON-LD for search engines: the Sharadox organization and website. */
export function StructuredData({ locale }: StructuredDataProperties) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        slogan: translate(SITE.slogan, locale),
        description: translate(SITE.description, locale),
        logo: `${SITE.url}/icon.svg`,
        address: { "@type": "PostalAddress", addressRegion: "Algarve", addressCountry: "PT" },
        areaServed: "Worldwide",
        knowsAbout: ["Web development", "Web design", "Mobile applications", "Software platforms"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: `${SITE.url}/${locale}`,
        name: SITE.name,
        inLanguage: languageTag(locale),
        publisher: { "@id": `${SITE.url}/#organization` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

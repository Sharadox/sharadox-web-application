import type { MetadataRoute } from "next";
import { SITE } from "@sharadox/sharadox-web-application/content/site";
import { LOCALES } from "@sharadox/sharadox-web-application/utility/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages: Object.fromEntries(LOCALES.map((alternate) => [alternate, `${SITE.url}/${alternate}`])) },
  }));
}

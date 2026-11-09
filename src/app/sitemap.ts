import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { LOCALES } from "@/utilities/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages: Object.fromEntries(LOCALES.map((alternate) => [alternate, `${SITE.url}/${alternate}`])) },
  }));
}

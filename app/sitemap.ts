import type { MetadataRoute } from "next";
import { LOCALES, SITE } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((l) => ({
    url: `${SITE.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: l === "en" ? 1 : 0.9,
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE.url}/${x}`])) },
  }));
}

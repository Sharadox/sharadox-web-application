import type { MetadataRoute } from "next";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { LOCALES } from "@sharadox/sharadox-web-library/utility/locale";
import { localizedSitemap } from "@sharadox/web-library/search-engine/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return localizedSitemap({ url: SITE.url, locales: LOCALES, otherPriority: 0.9, changeFrequency: "monthly" });
}

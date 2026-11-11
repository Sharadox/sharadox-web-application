import { localizedSitemap } from "@sharadox/metadata-web-library/sitemap";
import { LICENSE } from "@sharadox/sharadox-web-library/content/license";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { SITE } from "@sharadox/sharadox-web-library/content/site";

export default function sitemap() {
  return [
    ...localizedSitemap({ url: SITE.url, locales: LOCALES, otherPriority: 0.9 }),
    ...localizedSitemap({
      url: SITE.url,
      locales: LOCALES,
      paths: [LICENSE.path],
      priority: 0.2,
      otherPriority: 0.2,
      changeFrequency: "yearly",
    }),
  ];
}

import { localizedSitemap } from "@sharadox/metadata-web-library/sitemap";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { SITE } from "@sharadox/sharadox-web-library/content/site";

export default function sitemap() {
  return localizedSitemap({ url: SITE.url, locales: LOCALES, otherPriority: 0.9 });
}

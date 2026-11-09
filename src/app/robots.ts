import type { MetadataRoute } from "next";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { robots as robotRules } from "@sharadox/web-library/search-engine/robots";

export default function robots(): MetadataRoute.Robots {
  return robotRules({ url: SITE.url, indexable: true });
}

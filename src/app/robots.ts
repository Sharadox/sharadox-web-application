import type { MetadataRoute } from "next";
import { SITE } from "@sharadox/sharadox-web-application/content/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}

import { securityTextRoute } from "@sharadox/metadata-web-library/route";
import { SITE } from "@sharadox/sharadox-web-library/content/site";

export const dynamic = "force-static";

/** How to report a security problem (RFC 9116), renewed for a year with every build. */
export const { GET } = securityTextRoute({
  contact: `mailto:${SITE.email}`,
  url: SITE.url,
  preferredLanguages: ["en", "pt"],
});

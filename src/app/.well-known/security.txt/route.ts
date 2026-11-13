import { securityText } from "@sharadox/metadata-web-library/security-text";
import { SITE } from "@sharadox/sharadox-web-library/content/site";

export const dynamic = "force-static";

/** How to report a security problem (RFC 9116), renewed for a year with every build. */
export function GET() {
  return new Response(
    securityText({
      contact: `mailto:${SITE.email}`,
      canonical: `${SITE.url}/.well-known/security.txt`,
      preferredLanguages: ["en", "pt"],
    }),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}

import { defineNextConfiguration } from "@sharadox/next-js-configuration-web-library/next-configuration";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";

export default defineNextConfiguration({
  root: new URL("./", import.meta.url),
  styleLibrary: "@sharadox/sharadox-web-library",
  locales: LOCALES,
  productionDomain: "sharadox.com",
  next: {
    // The portfolio's live parts load their photos from the client's own site.
    images: { remotePatterns: [{ protocol: "https", hostname: "luispiresdecor.com" }] },
    // A project's earlier address leads to its current one (temporarily, as every redirect here).
    async redirects() {
      return [
        {
          source: "/:locale/portfolio/luis-pires-decor",
          destination: "/:locale/portfolio/luis-pires-decor-website-and-rebranding",
          permanent: false,
        },
      ];
    },
  },
});

import { defineNextConfiguration } from "@sharadox/next-js-configuration-web-library/next-configuration";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";

export default defineNextConfiguration({
  root: new URL("./", import.meta.url),
  styleLibrary: "@sharadox/sharadox-web-library",
  locales: LOCALES,
  productionDomain: "sharadox.com",
  next: {
    // One 404 for addresses outside every locale too (src/app/global-not-found.tsx).
    experimental: { globalNotFound: true },
  },
});

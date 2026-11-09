import { localeRedirects } from "@sharadox/web-library/internationalization/locale-redirect";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const config: NextConfig = {
  sassOptions: {
    // `@use "style/token"` resolves to the design tokens shipped with @sharadox/sharadox-web-library.
    loadPaths: [
      fileURLToPath(new URL("./node_modules/@sharadox/sharadox-web-library/distribution", import.meta.url)),
      fileURLToPath(new URL("./src", import.meta.url)),
    ],
  },
  async redirects() {
    return localeRedirects(["en", "pt"], "en");
  },
};

export default config;

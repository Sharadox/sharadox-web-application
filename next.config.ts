import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const config: NextConfig = {
  // Lets stylesheets `@use "styles/tokens"` from anywhere under src/.
  sassOptions: { loadPaths: [fileURLToPath(new URL("./src", import.meta.url))] },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "header", key: "accept-language", value: "pt.*" }],
        destination: "/pt",
        permanent: false,
      },
      { source: "/", destination: "/en", permanent: false },
    ];
  },
};

export default config;

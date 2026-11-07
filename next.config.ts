import type { NextConfig } from "next";

const config: NextConfig = {
  async redirects() {
    return [
      { source: "/", has: [{ type: "header", key: "accept-language", value: "pt.*" }], destination: "/pt", permanent: false },
      { source: "/", destination: "/en", permanent: false },
    ];
  },
};
export default config;

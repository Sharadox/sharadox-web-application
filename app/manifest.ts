import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sharadox",
    short_name: "Sharadox",
    description: "Technologies that simplify the world.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }, { src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}

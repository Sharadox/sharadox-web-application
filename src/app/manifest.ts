import { webManifest } from "@sharadox/metadata-web-library/manifest";

/** Installable, online only. The PNG and maskable icons join once the final logo exists. */
export default function manifest() {
  return webManifest({
    name: "Sharadox",
    description: "Technologies that simplify the world.",
    backgroundColor: "#000000",
    themeColor: "#000000",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  });
}

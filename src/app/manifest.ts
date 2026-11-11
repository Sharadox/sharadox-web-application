import { webManifest } from "@sharadox/metadata-web-library/manifest";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { SLOGAN } from "@sharadox/sharadox-web-library/content/slogan";

/** Installable, online only. The PNG and maskable icons join once the final logo exists. */
export default function manifest() {
  return webManifest({
    name: "Sharadox",
    description: SLOGAN[LOCALES.defaultLocale],
    backgroundColor: "#000000",
    themeColor: "#000000",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  });
}

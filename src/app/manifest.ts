import { webManifest } from "@sharadox/metadata-web-library/manifest";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { SLOGAN } from "@sharadox/sharadox-web-library/content/slogan";

/**
 * Installable, online only. The icons (SVG, 192 and 512 PNG, maskable) come from the current placeholder mark and are
 * redrawn once the final logo exists.
 */
export default function manifest() {
  return webManifest({
    name: "Sharadox",
    description: SLOGAN[LOCALES.defaultLocale],
    backgroundColor: "#000000",
    themeColor: "#000000",
  });
}

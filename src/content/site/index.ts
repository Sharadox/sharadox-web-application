import type { Translated } from "@/utilities/locale/type";

/** Site-wide identity used by metadata, structured data, sitemap and share images. */
export const SITE = {
  name: "Sharadox",
  url: "https://sharadox.com",
  email: "email@sharadox.com",
  slogan: {
    en: "Technologies that simplify the world",
    pt: "Tecnologias que simplificam o mundo",
  } satisfies Translated,
  description: {
    en: "Sharadox designs and builds websites, platforms and apps that make complex things simple. Based in the Algarve, Portugal, working worldwide.",
    pt: "A Sharadox desenha e constrói websites, plataformas e aplicações que tornam simples o que é complexo. No Algarve, Portugal, para o mundo.",
  } satisfies Translated,
  keywords: {
    en: ["web development", "websites", "apps", "platforms", "Algarve", "Portugal", "Next.js", "design studio"],
    pt: ["desenvolvimento web", "websites", "aplicações", "plataformas", "Algarve", "Portugal", "Next.js", "design"],
  },
};

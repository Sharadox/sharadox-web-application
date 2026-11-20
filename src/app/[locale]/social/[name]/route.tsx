import { socialImageRoute } from "@sharadox/metadata-web-library/route";
import { renderSocialImage } from "@sharadox/sharadox-web-library/component/social-image";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";

/** Every social image, drawn once at build time for each language (a route has no layout to take the languages from). */
export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * The images to post on social media (`/en/social/landscape.png`, `/pt/social/portrait-headline.png`…): the mark on
 * black, landscape and portrait, alone or with the headline.
 */
export const { GET, generateStaticParams } = socialImageRoute({ locales: LOCALES, render: renderSocialImage });

import { notFound } from "next/navigation";
import { isSocialImageName, SOCIAL_IMAGES } from "@sharadox/metadata-web-library/social-image";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { renderSocialImage } from "@sharadox/sharadox-web-library/component/social-image";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";

/** Every social image, drawn once at build time for each language (a route has no layout to take the languages from). */
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () =>
  LOCALES.staticParams().flatMap(({ locale }) => Object.keys(SOCIAL_IMAGES).map((name) => ({ locale, name })));

/**
 * The images to post on social media (`/en/social/landscape.png`, `/pt/social/portrait-headline.png`…): the mark on
 * black, landscape and portrait, alone or with the headline.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; name: string }> }) {
  const { locale, name } = await params;
  if (!isSocialImageName(name)) notFound();
  return renderSocialImage({ locale: locale as Locale, name });
}

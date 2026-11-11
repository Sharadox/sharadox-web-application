import { renderShareImage } from "@sharadox/sharadox-web-library/component/share-image";
import { SHARE_IMAGE_SIZE } from "@sharadox/metadata-web-library/share-image";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";

export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Sharadox";
export const generateStaticParams = () => LOCALES.staticParams();

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  return renderShareImage({ locale: (await params).locale as Locale, ...size });
}

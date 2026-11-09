import { renderShareImage } from "@sharadox/sharadox-web-library/component/share-image";
import { LOCALES } from "@sharadox/sharadox-web-library/utility/locale";
import type { Locale } from "@sharadox/sharadox-web-library/utility/locale/type";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sharadox";
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  return renderShareImage({ locale: (await params).locale as Locale, ...size });
}

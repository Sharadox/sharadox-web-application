import { renderShareImage } from "@/components/share-image";
import { LOCALES } from "@/utilities/locale";
import type { Locale } from "@/utilities/locale/type";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sharadox";
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  return renderShareImage({ locale: (await params).locale as Locale, ...size });
}

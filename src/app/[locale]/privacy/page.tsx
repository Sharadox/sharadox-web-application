import type { Metadata } from "next";
import { Consent } from "@sharadox/sharadox-web-library/component/consent";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { PrivacyPage } from "@sharadox/sharadox-web-library/component/privacy-page";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { PRIVACY_PAGE } from "@sharadox/sharadox-web-library/content/privacy";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { separate } from "@sharadox/sharadox-web-library/utility/separate";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { pageMetadata } from "@sharadox/metadata-web-library/page-metadata";
import { Cursor } from "@sharadox/pointer-web-library/cursor";
import { SmoothScroll } from "@sharadox/scroll-web-library/smooth-scroll";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata({
    name: SITE.name,
    url: SITE.url,
    locales: LOCALES,
    locale,
    path: PRIVACY_PAGE.path,
    title: separate(translate(PRIVACY_PAGE.title, locale), SITE.name),
    description: translate(PRIVACY_PAGE.description, locale),
    image: { path: `/${locale}/opengraph-image`, alt: SITE.name },
  });
}

export default async function Privacy({ params }: PageProps<"/[locale]/privacy">) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Navigation locale={locale} path={PRIVACY_PAGE.path} />
      <main>
        <PrivacyPage locale={locale} />
      </main>
      <Footer locale={locale} path={PRIVACY_PAGE.path} />
      <Consent locale={locale} />
    </>
  );
}

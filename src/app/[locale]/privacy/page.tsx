import type { Metadata } from "next";
import { PrivacyPage } from "@sharadox/sharadox-web-library/component/privacy-page";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { PRIVACY_PAGE } from "@sharadox/sharadox-web-library/content/privacy";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { PageFrame } from "@sharadox/sharadox-web-library/component/page-frame";
import { siteMetadata } from "@sharadox/sharadox-web-library/utility/site-metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return siteMetadata({
    locale,
    path: PRIVACY_PAGE.path,
    title: translate(PRIVACY_PAGE.title, locale),
    description: translate(PRIVACY_PAGE.description, locale),
  });
}

export default async function Privacy({ params }: PageProps<"/[locale]/privacy">) {
  const locale = (await params).locale as Locale;
  return (
    <PageFrame locale={locale} path={PRIVACY_PAGE.path}>
      <PrivacyPage locale={locale} />
    </PageFrame>
  );
}

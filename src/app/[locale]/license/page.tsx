import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { License } from "@sharadox/sharadox-web-library/component/license";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { LICENSE } from "@sharadox/sharadox-web-library/content/license";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { separate } from "@sharadox/sharadox-web-library/utility/separate";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { pageMetadata } from "@sharadox/metadata-web-library/page-metadata";
import { Cursor } from "@sharadox/pointer-web-library/cursor";
import { SmoothScroll } from "@sharadox/scroll-web-library/smooth-scroll";

/** The binding Portuguese original, or its English translation; both live at the repository's root. */
const READ = {
  pt: () => readFile(join(process.cwd(), "LICENCA.md"), "utf8"),
  en: () => readFile(join(process.cwd(), "LICENSE.md"), "utf8"),
} as const satisfies Record<Locale, () => Promise<string>>;

export async function generateMetadata({ params }: PageProps<"/[locale]/license">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const title = translate(LICENSE.title, locale);
  return pageMetadata({
    name: SITE.name,
    url: SITE.url,
    locales: LOCALES,
    locale,
    path: LICENSE.path,
    title: separate(title, SITE.name),
    description: translate(LICENSE.description, locale),
    image: { path: `/${locale}/opengraph-image`, alt: SITE.name },
  });
}

export default async function LicensePage({ params }: PageProps<"/[locale]/license">) {
  const locale = (await params).locale as Locale;
  const markdown = await READ[locale]();
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Navigation locale={locale} path={LICENSE.path} />
      <main>
        <License locale={locale} markdown={markdown} />
      </main>
      <Footer locale={locale} path={LICENSE.path} />
    </>
  );
}

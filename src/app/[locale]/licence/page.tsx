import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { Consent } from "@sharadox/sharadox-web-library/component/consent";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Licence } from "@sharadox/sharadox-web-library/component/licence";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { LICENCE } from "@sharadox/sharadox-web-library/content/licence";
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

export async function generateMetadata({ params }: PageProps<"/[locale]/licence">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const title = translate(LICENCE.title, locale);
  return pageMetadata({
    name: SITE.name,
    url: SITE.url,
    locales: LOCALES,
    locale,
    path: LICENCE.path,
    title: separate(title, SITE.name),
    description: translate(LICENCE.description, locale),
  });
}

export default async function LicencePage({ params }: PageProps<"/[locale]/licence">) {
  const locale = (await params).locale as Locale;
  const markdown = await READ[locale]();
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Navigation locale={locale} path={LICENCE.path} />
      <main>
        <Licence locale={locale} markdown={markdown} />
      </main>
      <Footer locale={locale} path={LICENCE.path} />
      <Consent locale={locale} />
    </>
  );
}

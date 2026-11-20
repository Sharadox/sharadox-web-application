import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { License } from "@sharadox/sharadox-web-library/component/license";
import { LICENSE } from "@sharadox/sharadox-web-library/content/license";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { PageFrame } from "@sharadox/sharadox-web-library/component/page-frame";
import { siteMetadata } from "@sharadox/sharadox-web-library/utility/site-metadata";

/** The binding Portuguese original, or its English translation; both live at the repository's root. */
const READ = {
  pt: () => readFile(join(process.cwd(), "LICENCA.md"), "utf8"),
  en: () => readFile(join(process.cwd(), "LICENSE.md"), "utf8"),
} as const satisfies Record<Locale, () => Promise<string>>;

export async function generateMetadata({ params }: PageProps<"/[locale]/license">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const title = translate(LICENSE.title, locale);
  return siteMetadata({
    locale,
    path: LICENSE.path,
    title,
    description: translate(LICENSE.description, locale),
  });
}

export default async function LicensePage({ params }: PageProps<"/[locale]/license">) {
  const locale = (await params).locale as Locale;
  const markdown = await READ[locale]();
  return (
    <PageFrame locale={locale} path={LICENSE.path}>
      <License locale={locale} markdown={markdown} />
    </PageFrame>
  );
}

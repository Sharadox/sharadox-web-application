import { Contact } from "@sharadox/sharadox-web-application/component/contact";
import { Cursor } from "@sharadox/sharadox-web-application/component/cursor";
import { Footer } from "@sharadox/sharadox-web-application/component/footer";
import { Hero } from "@sharadox/sharadox-web-application/component/hero";
import { Marquee } from "@sharadox/sharadox-web-application/component/marquee";
import { Navigation } from "@sharadox/sharadox-web-application/component/navigation";
import { Process } from "@sharadox/sharadox-web-application/component/process";
import { Services } from "@sharadox/sharadox-web-application/component/services";
import { SmoothScroll } from "@sharadox/sharadox-web-application/component/smooth-scroll";
import { Statement } from "@sharadox/sharadox-web-application/component/statement";
import { STATEMENT } from "@sharadox/sharadox-web-application/content/statement";
import type { Locale } from "@sharadox/sharadox-web-application/utility/locale/type";
import { translate } from "@sharadox/sharadox-web-application/utility/translate";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Navigation locale={locale} />
      <main>
        <Hero locale={locale} />
        <Statement text={translate(STATEMENT, locale)} />
        <Services locale={locale} />
        <Marquee />
        <Process locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}

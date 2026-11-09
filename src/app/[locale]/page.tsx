import { sendContactAction } from "@sharadox/sharadox-web-application/action/send-contact";
import { Contact } from "@sharadox/sharadox-web-library/component/contact";
import { Cursor } from "@sharadox/sharadox-web-library/component/cursor";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Hero } from "@sharadox/sharadox-web-library/component/hero";
import { Marquee } from "@sharadox/sharadox-web-library/component/marquee";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { Process } from "@sharadox/sharadox-web-library/component/process";
import { Services } from "@sharadox/sharadox-web-library/component/services";
import { SmoothScroll } from "@sharadox/web-library/animation/smooth-scroll";
import { Statement } from "@sharadox/sharadox-web-library/component/statement";
import { STATEMENT } from "@sharadox/sharadox-web-library/content/statement";
import type { Locale } from "@sharadox/sharadox-web-library/utility/locale/type";
import { translate } from "@sharadox/web-library/internationalization/translate";

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
        <Contact locale={locale} action={sendContactAction} />
      </main>
      <Footer locale={locale} />
    </>
  );
}

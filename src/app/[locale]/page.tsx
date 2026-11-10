import { sendContactAction } from "@sharadox/sharadox-web-application/action/send-contact";
import { Capability } from "@sharadox/sharadox-web-library/component/capability";
import { Contact } from "@sharadox/sharadox-web-library/component/contact";
import { Cursor } from "@sharadox/sharadox-web-library/component/cursor";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Hero } from "@sharadox/sharadox-web-library/component/hero";
import { Marquee } from "@sharadox/sharadox-web-library/component/marquee";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { Process } from "@sharadox/sharadox-web-library/component/process";
import { ServiceIndex } from "@sharadox/sharadox-web-library/component/service-index";
import { Services } from "@sharadox/sharadox-web-library/component/services";
import { Statement } from "@sharadox/sharadox-web-library/component/statement";
import { Touchpoint } from "@sharadox/sharadox-web-library/component/touchpoint";
import { STATEMENT } from "@sharadox/sharadox-web-library/content/statement";
import type { Locale } from "@sharadox/sharadox-web-library/utility/locale/type";
import { SmoothScroll } from "@sharadox/web-library/animation/smooth-scroll";
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
        <ServiceIndex locale={locale} />
        <Statement text={translate(STATEMENT, locale)} />
        <Services locale={locale} />
        <Touchpoint locale={locale} />
        <Capability locale={locale} />
        <Marquee />
        <Process locale={locale} />
        <Contact locale={locale} action={sendContactAction} />
      </main>
      <Footer locale={locale} />
    </>
  );
}

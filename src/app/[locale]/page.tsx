import { sendContactAction } from "@sharadox/sharadox-web-application/action/send-contact";
import { About } from "@sharadox/sharadox-web-library/component/about";
import { Capability } from "@sharadox/sharadox-web-library/component/capability";
import { Contact } from "@sharadox/sharadox-web-library/component/contact";
import { Cursor } from "@sharadox/pointer-web-library/cursor";
import { Consent } from "@sharadox/sharadox-web-library/component/consent";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Hero } from "@sharadox/sharadox-web-library/component/hero";
import { Marquee } from "@sharadox/sharadox-web-library/component/marquee";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { Process } from "@sharadox/sharadox-web-library/component/process";
import { SectionIndicator } from "@sharadox/sharadox-web-library/component/section-indicator";
import { ServiceIndex } from "@sharadox/sharadox-web-library/component/service-index";
import { Services } from "@sharadox/sharadox-web-library/component/services";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <Cursor />
      <Navigation locale={locale} />
      <SectionIndicator locale={locale} />
      <main>
        <Hero locale={locale} />
        <ServiceIndex locale={locale} />
        <About locale={locale} />
        <Services locale={locale} />
        <Capability locale={locale} />
        <Marquee />
        <Process locale={locale} />
        <Contact locale={locale} action={sendContactAction} />
      </main>
      <Footer locale={locale} />
      <Consent locale={locale} />
    </>
  );
}

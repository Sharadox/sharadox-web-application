import { sendContactAction } from "@sharadox/sharadox-web-application/action/send-contact";
import { About } from "@sharadox/sharadox-web-library/component/about";
import { Capability } from "@sharadox/sharadox-web-library/component/capability";
import { Contact } from "@sharadox/sharadox-web-library/component/contact";
import { Faq } from "@sharadox/sharadox-web-library/component/faq";
import { Hero } from "@sharadox/sharadox-web-library/component/hero";
import { Marquee } from "@sharadox/sharadox-web-library/component/marquee";
import { Portfolio } from "@sharadox/sharadox-web-library/component/portfolio";
import { Process } from "@sharadox/sharadox-web-library/component/process";
import { SectionIndicator } from "@sharadox/sharadox-web-library/component/section-indicator";
import { ServiceIndex } from "@sharadox/sharadox-web-library/component/service-index";
import { ServiceUnlisted } from "@sharadox/sharadox-web-library/component/service-unlisted";
import { Services } from "@sharadox/sharadox-web-library/component/services";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { PageFrame } from "@sharadox/sharadox-web-library/component/page-frame";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  return (
    <PageFrame locale={locale} aside={<SectionIndicator locale={locale} />}>
      <Hero locale={locale} />
      <ServiceIndex locale={locale} />
      <About locale={locale} />
      <Services locale={locale} />
      <Capability locale={locale} />
      <ServiceUnlisted locale={locale} />
      <Marquee />
      <Portfolio locale={locale} />
      <Process locale={locale} />
      <Faq locale={locale} />
      <Contact locale={locale} action={sendContactAction} />
    </PageFrame>
  );
}

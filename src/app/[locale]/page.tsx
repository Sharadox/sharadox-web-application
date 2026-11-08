import { Contact } from "@/components/contact";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Nav } from "@/components/nav";
import { Process } from "@/components/process";
import { Services } from "@/components/services";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Statement } from "@/components/statement";
import { STATEMENT } from "@/content/statement";
import type { Locale } from "@/utilities/locale/type";
import { translate } from "@/utilities/translate";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Nav locale={locale} />
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

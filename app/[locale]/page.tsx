import { copy, tr, type Locale } from "@/content";
import { Contact } from "@/components/Contact";
import { Cursor, SmoothScroll } from "@/components/Effects";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Statement } from "@/components/Statement";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const l = (await params).locale as Locale;
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Nav l={l} />
      <main>
        <Hero l={l} />
        <Statement text={tr(copy.statement, l)} />
        <Services l={l} />
        <Marquee />
        <Process l={l} />
        <Contact l={l} />
      </main>
      <Footer l={l} />
    </>
  );
}

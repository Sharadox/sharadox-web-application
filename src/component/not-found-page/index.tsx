"use client";
import { usePathname } from "next/navigation";
import { Cursor } from "@sharadox/pointer-web-library/cursor";
import { SmoothScroll } from "@sharadox/scroll-web-library/smooth-scroll";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { NotFound } from "@sharadox/sharadox-web-library/component/not-found";
import { ServiceIndex } from "@sharadox/sharadox-web-library/component/service-index";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import type { NotFoundPageProperties } from "@sharadox/sharadox-web-application/component/not-found-page/type";

/**
 * The whole 404 page. Not-found pages get no route parameters, so the language comes from the address: its first
 * segment when it is a published locale, otherwise the default. The language switch keeps the rest of the address.
 */
export function NotFoundPage({ path }: NotFoundPageProperties) {
  const current = usePathname();
  const address = path ?? current ?? "/";
  const [, first = "", ...rest] = address.split("/");
  const locale = LOCALES.isLocale(first) ? first : LOCALES.defaultLocale;
  const after = LOCALES.isLocale(first) ? (rest.length ? `/${rest.join("/")}` : "/") : "/";
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Navigation locale={locale} path={after} />
      <main>
        <NotFound locale={locale} path={address} />
        <ServiceIndex locale={locale} base={`/${locale}`} />
      </main>
      <Footer locale={locale} path={after} />
    </>
  );
}

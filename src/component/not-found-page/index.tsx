"use client";
import { usePathname } from "next/navigation";
import { NotFound } from "@sharadox/sharadox-web-library/component/not-found";
import { ServiceIndex } from "@sharadox/sharadox-web-library/component/service-index";
import { PageFrame } from "@sharadox/sharadox-web-library/component/page-frame";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import type { NotFoundPageProperties } from "@sharadox/sharadox-web-application/component/not-found-page/type";

/**
 * The whole 404 page. Not-found pages get no route parameters, so the language comes from the address: its first
 * segment when it is a published locale, otherwise the default. The language switch keeps the rest of the address.
 */
export function NotFoundPage({ path }: NotFoundPageProperties) {
  const current = usePathname();
  const address = path ?? current ?? "/";
  const { locale, path: after } = LOCALES.splitPath(address);
  return (
    <PageFrame locale={locale} path={after}>
      <NotFound locale={locale} path={address} />
      <ServiceIndex locale={locale} base={`/${locale}`} />
    </PageFrame>
  );
}

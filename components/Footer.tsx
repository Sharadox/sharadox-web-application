import Link from "next/link";
import { copy, LOCALES, SITE, tr, type Locale } from "@/content";

export function Footer({ l }: { l: Locale }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p className="footer-slogan">{tr(SITE.slogan, l)}.</p>
        <div className="footer-links">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span className="lang-inline">
            {LOCALES.map((x) => <Link key={x} href={`/${x}`} hrefLang={x} aria-current={x === l ? "true" : undefined}>{x === "en" ? "English" : "Português"}</Link>)}
          </span>
          <a href="#top">{tr(copy.footer.top, l)} ↑</a>
        </div>
      </div>
      <div className="footer-mark" aria-hidden>Sharadox</div>
      <p className="footer-legal mono">© {new Date().getFullYear()} Sharadox · {tr(copy.footer.rights, l)}</p>
    </footer>
  );
}

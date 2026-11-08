import Link from "next/link";
import { FOOTER } from "@/content/footer";
import { SITE } from "@/content/site";
import { LOCALES } from "@/utilities/locale";
import { translate } from "@/utilities/translate";
import styles from "./index.module.scss";
import type { FooterProps } from "./type";

/** Slogan, links, the big gradient wordmark and the legal line. */
export function Footer({ locale }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.slogan}>{translate(SITE.slogan, locale)}.</p>
        <div className={styles.links}>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span className={styles.languages}>
            {LOCALES.map((l) => (
              <Link key={l} href={`/${l}`} hrefLang={l} aria-current={l === locale ? "true" : undefined}>
                {l === "en" ? "English" : "Português"}
              </Link>
            ))}
          </span>
          <a href="#top">{translate(FOOTER.top, locale)} ↑</a>
        </div>
      </div>
      <div className={styles.mark} aria-hidden>
        Sharadox
      </div>
      <p className={`${styles.legal} mono`}>
        © {new Date().getFullYear()} Sharadox · {translate(FOOTER.rights, locale)}
      </p>
    </footer>
  );
}

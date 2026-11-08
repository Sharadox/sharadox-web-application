import Link from "next/link";
import { LOCALES } from "@/utilities/locale";
import styles from "./index.module.scss";
import type { LanguageSwitchProps } from "./type";

/** EN/PT pill toggle. */
export function LanguageSwitch({ locale }: LanguageSwitchProps) {
  return (
    <div className={styles.switch} role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <Link key={l} href={`/${l}`} hrefLang={l} aria-current={l === locale ? "true" : undefined}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

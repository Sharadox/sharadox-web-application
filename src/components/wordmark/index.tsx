import styles from "./index.module.scss";
import type { WordmarkProperties } from "./type";

/** The Sharadox wordmark (temporary glyph until the final logo). */
export function Wordmark({ href }: WordmarkProperties) {
  return (
    <a href={href} className={styles.wordmark} aria-label="Sharadox">
      <span className={styles.glyph} aria-hidden />
      Sharadox
    </a>
  );
}

import { STACK } from "@sharadox/sharadox-web-application/content/stack";
import styles from "./index.module.scss";

/** Endless strip of the technologies we work with. */
export function Marquee() {
  const row = [...STACK, ...STACK];
  return (
    <div className={styles.marquee} aria-label={STACK.join(", ")}>
      <div className={styles.track} aria-hidden>
        {row.map((technology, index) => (
          <span key={index} className={`${styles.pill} monospace`}>
            {technology}
          </span>
        ))}
      </div>
    </div>
  );
}

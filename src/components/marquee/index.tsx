import { STACK } from "@/content/stack";
import styles from "./index.module.scss";

/** Endless strip of the technologies we work with. */
export function Marquee() {
  const row = [...STACK, ...STACK];
  return (
    <div className={styles.marquee} aria-label={STACK.join(", ")}>
      <div className={styles.track} aria-hidden>
        {row.map((t, i) => (
          <span key={i} className={`${styles.pill} mono`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

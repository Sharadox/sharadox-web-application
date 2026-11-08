import styles from "./index.module.scss";
import type { SectionProps } from "./type";

/** A full-width page section with the standard width and vertical rhythm. */
export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={[styles.section, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

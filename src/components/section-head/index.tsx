import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import styles from "./index.module.scss";
import type { SectionHeadProps } from "./type";

/** Eyebrow and title that open a section. */
export function SectionHead({ eyebrow, title }: SectionHeadProps) {
  return (
    <Reveal className={styles.head}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
    </Reveal>
  );
}

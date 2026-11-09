import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import styles from "./index.module.scss";
import type { SectionHeadProperties } from "./type";

/** Eyebrow and title that open a section. */
export function SectionHeading({ eyebrow, title }: SectionHeadProperties) {
  return (
    <Reveal className={styles.heading}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
    </Reveal>
  );
}

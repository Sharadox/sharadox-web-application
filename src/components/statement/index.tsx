"use client";
import { useScroll } from "motion/react";
import { useRef } from "react";
import styles from "./index.module.scss";
import type { StatementProps } from "./type";
import { Word } from "./word";

/** A large sentence that lights up word by word as it scrolls through the viewport. */
export function Statement({ text }: StatementProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 40%"] });
  const words = text.split(" ");
  return (
    <section className={styles.wrap}>
      <p ref={ref} className={styles.statement}>
        {words.map((w, i) => (
          <Word key={i} word={w} index={i} count={words.length} progress={scrollYProgress} />
        ))}
      </p>
    </section>
  );
}

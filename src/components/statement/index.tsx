"use client";
import { useScroll } from "motion/react";
import { useRef } from "react";
import styles from "./index.module.scss";
import type { StatementProperties } from "./type";
import { Word } from "./word";

/** A large sentence that lights up word by word as it scrolls through the viewport. */
export function Statement({ text }: StatementProperties) {
  const paragraph = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: paragraph, offset: ["start 80%", "end 40%"] });
  const words = text.split(" ");
  return (
    <section className={styles.wrapper}>
      <p ref={paragraph} className={styles.statement}>
        {words.map((word, index) => (
          <Word key={index} word={word} index={index} count={words.length} progress={scrollYProgress} />
        ))}
      </p>
    </section>
  );
}

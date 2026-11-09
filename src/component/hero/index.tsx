"use client";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { Button } from "@sharadox/sharadox-web-application/component/button";
import { Eyebrow } from "@sharadox/sharadox-web-application/component/eyebrow";
import { GlobePlaceholder } from "@sharadox/sharadox-web-application/component/globe/placeholder";
import { HERO } from "@sharadox/sharadox-web-application/content/hero";
import { translate } from "@sharadox/sharadox-web-application/utility/translate";
import styles from "./index.module.scss";
import type { HeroProperties } from "./type";

const Globe = dynamic(() => import("@sharadox/sharadox-web-application/component/globe"), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});
const EASE = [0.22, 1, 0.36, 1] as const;

/** First screen: the slogan rising line by line beside the interactive globe. */
export function Hero({ locale }: HeroProperties) {
  const lines = HERO.lines[locale];
  return (
    <section className={styles.hero}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.copy}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }}>
          <Eyebrow>
            <span className={styles.live} aria-hidden /> {translate(HERO.eyebrow, locale)}
          </Eyebrow>
        </motion.div>
        <h1 className={styles.title}>
          {lines.map((line, index) => (
            <span className={styles.line} key={index}>
              <motion.span
                className={index === lines.length - 1 ? `${styles.lineInner} ${styles.dim}` : styles.lineInner}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.2 + index * 0.12, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
        >
          {translate(HERO.subtitle, locale)}
        </motion.p>
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          <Button href="#contact" arrow>
            {translate(HERO.primary, locale)}
          </Button>
          <Button href="#services" variant="ghost">
            {translate(HERO.secondary, locale)}
          </Button>
        </motion.div>
      </div>
      <motion.div
        className={styles.globe}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
      >
        <Globe />
        <span className={`${styles.hint} monospace`} aria-hidden>
          {translate(HERO.drag, locale)}
        </span>
      </motion.div>
    </section>
  );
}

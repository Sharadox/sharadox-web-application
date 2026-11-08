"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Section } from "@/components/section";
import { SectionHead } from "@/components/section-head";
import { PROCESS } from "@/content/process";
import { translate } from "@/utilities/translate";
import styles from "./index.module.scss";
import { Step } from "./step";
import type { ProcessProps } from "./type";

/** Four steps on a line that draws itself as you scroll through the section. */
export function Process({ locale }: ProcessProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const steps = PROCESS.steps;
  return (
    <Section id="process">
      <SectionHead eyebrow={translate(PROCESS.eyebrow, locale)} title={translate(PROCESS.title, locale)} />
      <div ref={ref} className={styles.process}>
        <div className={styles.line} aria-hidden>
          <motion.span style={{ width }} />
        </div>
        {steps.map((s, i) => (
          <Step
            key={s.n}
            index={i}
            count={steps.length}
            progress={scrollYProgress}
            number={s.n}
            title={translate(s.title, locale)}
            text={translate(s.text, locale)}
          />
        ))}
      </div>
    </Section>
  );
}

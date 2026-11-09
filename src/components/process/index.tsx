"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { PROCESS } from "@/content/process";
import { translate } from "@/utilities/translate";
import styles from "./index.module.scss";
import { Step } from "./step";
import type { ProcessProperties } from "./type";

/** Four steps on a line that draws itself as you scroll through the section. */
export function Process({ locale }: ProcessProperties) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start 75%", "end 55%"] });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const steps = PROCESS.steps;
  return (
    <Section id="process">
      <SectionHeading eyebrow={translate(PROCESS.eyebrow, locale)} title={translate(PROCESS.title, locale)} />
      <div ref={container} className={styles.process}>
        <div className={styles.line} aria-hidden>
          <motion.span style={{ width }} />
        </div>
        {steps.map((step, index) => (
          <Step
            key={step.number}
            index={index}
            count={steps.length}
            progress={scrollYProgress}
            number={step.number}
            title={translate(step.title, locale)}
            text={translate(step.text, locale)}
          />
        ))}
      </div>
    </Section>
  );
}

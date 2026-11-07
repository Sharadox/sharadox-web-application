"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { copy, tr, type Locale } from "@/content";
import { Reveal } from "./Reveal";

/** Four steps on a line that draws itself as you scroll through the section. */
export function Process({ l }: { l: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const steps = copy.process.steps;
  return (
    <section className="section" id="process">
      <Reveal className="section-head">
        <p className="eyebrow mono">{tr(copy.process.eyebrow, l)}</p>
        <h2>{tr(copy.process.title, l)}</h2>
      </Reveal>
      <div ref={ref} className="process">
        <div className="process-line" aria-hidden><motion.span style={{ width }} /></div>
        {steps.map((s, i) => (
          <Step key={s.n} i={i} n={steps.length} p={scrollYProgress} num={s.n} title={tr(s.title, l)} text={tr(s.text, l)} />
        ))}
      </div>
    </section>
  );
}

function Step({ i, n, p, num, title, text }: { i: number; n: number; p: import("motion/react").MotionValue<number>; num: string; title: string; text: string }) {
  const at = i / (n - 1);
  const opacity = useTransform(p, [Math.max(0, at - 0.25), at], [0.3, 1]);
  const glow = useTransform(p, [Math.max(0, at - 0.05), at], [0, 1]);
  return (
    <motion.div className="step" style={{ opacity }}>
      <motion.span className="step-dot" style={{ opacity: glow }} aria-hidden />
      <span className="mono step-n">{num}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}

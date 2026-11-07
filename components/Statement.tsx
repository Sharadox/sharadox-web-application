"use client";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const s = i / n;
  const opacity = useTransform(p, [s, s + 1.5 / n], [0.12, 1]);
  return <motion.span style={{ opacity }}>{w} </motion.span>;
}

export function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 40%"] });
  const words = text.split(" ");
  return (
    <section className="statement-wrap">
      <p ref={ref} className="statement">
        {words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} />)}
      </p>
    </section>
  );
}

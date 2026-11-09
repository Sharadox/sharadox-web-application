"use client";
import { motion } from "motion/react";
import type { RevealProperties } from "./type";

/** Fades, unblurs and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProperties) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

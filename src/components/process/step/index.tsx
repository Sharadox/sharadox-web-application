"use client";
import { motion, useTransform } from "motion/react";
import styles from "./index.module.scss";
import type { StepProps } from "./type";

/** One process step; brightens and lights its dot when the line reaches it. */
export function Step({ index, count, progress, number, title, text }: StepProps) {
  const at = index / (count - 1);
  const opacity = useTransform(progress, [Math.max(0, at - 0.25), at], [0.3, 1]);
  const glow = useTransform(progress, [Math.max(0, at - 0.05), at], [0, 1]);
  return (
    <motion.div className={styles.step} style={{ opacity }}>
      <motion.span className={styles.dot} style={{ opacity: glow }} aria-hidden />
      <span className={`mono ${styles.number}`}>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}

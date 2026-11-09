"use client";
import { motion, useTransform } from "motion/react";
import type { WordProperties } from "./type";

/** One word that brightens when scroll progress reaches its place in the sentence. */
export function Word({ word, index, count, progress }: WordProperties) {
  const start = index / count;
  const opacity = useTransform(progress, [start, start + 1.5 / count], [0.12, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

import type { MotionValue } from "motion/react";

export interface WordProperties {
  word: string;
  /** Position of the word in the sentence. */
  index: number;
  /** Number of words in the sentence. */
  count: number;
  progress: MotionValue<number>;
}

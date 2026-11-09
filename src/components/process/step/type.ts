import type { MotionValue } from "motion/react";

export interface StepProperties {
  index: number;
  count: number;
  progress: MotionValue<number>;
  number: string;
  title: string;
  text: string;
}

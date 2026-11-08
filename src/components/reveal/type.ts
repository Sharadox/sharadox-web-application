import type { ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Starting vertical offset in pixels. */
  y?: number;
  className?: string;
}

import type { ReactNode } from "react";

export interface CardProps {
  /** The live visual in the top (or left, when wide) half. */
  visual: ReactNode;
  tag: string;
  title: string;
  lead: string;
  text: string;
  /** Spans the full row with the visual beside the copy. */
  wide?: boolean;
}

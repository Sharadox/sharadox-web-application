import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  /** Renders a link when set, otherwise a button. */
  href?: string;
  variant?: "white" | "ghost";
  size?: "medium" | "small" | "block";
  /** Adds an arrow that nudges right on hover. */
  arrow?: boolean;
  disabled?: boolean;
  className?: string;
}

import styles from "./index.module.scss";
import type { EyebrowProperties } from "./type";

/** Small uppercase monospace label above a heading. */
export function Eyebrow({ children, className }: EyebrowProperties) {
  return <p className={[styles.eyebrow, "monospace", className].filter(Boolean).join(" ")}>{children}</p>;
}

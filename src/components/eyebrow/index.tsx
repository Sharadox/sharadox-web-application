import styles from "./index.module.scss";
import type { EyebrowProps } from "./type";

/** Small uppercase mono label above a heading. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={[styles.eyebrow, "mono", className].filter(Boolean).join(" ")}>{children}</p>;
}

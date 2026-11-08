import styles from "./index.module.scss";
import type { ButtonProps } from "./type";

/** Pill button or link. */
export function Button({
  children,
  href,
  variant = "white",
  size = "medium",
  arrow,
  disabled,
  className,
}: ButtonProps) {
  const cls = [styles.button, styles[variant], size !== "medium" && styles[size], className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden>
          →
        </span>
      )}
    </>
  );
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button className={cls} disabled={disabled}>
      {inner}
    </button>
  );
}

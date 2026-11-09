import styles from "./index.module.scss";
import type { ButtonProperties } from "./type";

/** Pill button or link. */
export function Button({
  children,
  href,
  variant = "white",
  size = "medium",
  arrow,
  disabled,
  className,
}: ButtonProperties) {
  const classNames = [styles.button, styles[variant], size !== "medium" && styles[size], className]
    .filter(Boolean)
    .join(" ");
  const content = (
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
    <a href={href} className={classNames}>
      {content}
    </a>
  ) : (
    <button className={classNames} disabled={disabled}>
      {content}
    </button>
  );
}

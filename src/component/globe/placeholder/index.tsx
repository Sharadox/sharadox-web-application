import styles from "../index.module.scss";

/** Same-size empty box shown while the globe's code loads, so the layout doesn't jump. */
export function GlobePlaceholder() {
  return <div className={styles.globe} />;
}

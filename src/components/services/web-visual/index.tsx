"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/in-view";
import styles from "./index.module.scss";

const CIRCUMFERENCE = 2 * Math.PI * 22;

/** A browser whose layout assembles itself, with a performance score counting to 100. */
export function WebVisual() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (!on) return;
    let v = 0;
    const id = setInterval(() => {
      v += 3;
      setScore(Math.min(100, v));
      if (v >= 100) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [on]);
  return (
    <div ref={ref} className={[styles.visual, on && styles.on].filter(Boolean).join(" ")} aria-hidden>
      <div className={styles.browser}>
        <div className={styles.bar}>
          <i />
          <i />
          <i />
          <span className={`${styles.url} mono`}>yourbusiness.com</span>
        </div>
        <div className={styles.body}>
          <div className={`${styles.skeleton} ${styles.nav}`} />
          <div className={`${styles.skeleton} ${styles.hero}`} />
          <div className={styles.row}>
            <div className={`${styles.skeleton} ${styles.card}`} />
            <div className={`${styles.skeleton} ${styles.card}`} />
            <div className={`${styles.skeleton} ${styles.card}`} />
          </div>
        </div>
      </div>
      <div className={styles.score}>
        <svg viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" className={styles.track} />
          <circle
            cx="26"
            cy="26"
            r="22"
            className={styles.progress}
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE * (1 - score / 100) }}
          />
        </svg>
        <span className="mono">{score}</span>
      </div>
    </div>
  );
}

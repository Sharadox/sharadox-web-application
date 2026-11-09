"use client";
import { useEffect, useState } from "react";
import { SERVICES } from "@sharadox/sharadox-web-application/content/services";
import styles from "./index.module.scss";
import type { AppVisualProperties } from "./type";

/** A phone with business notifications sliding in. */
export function ApplicationVisual({ locale }: AppVisualProperties) {
  const items = SERVICES.notifications[locale];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((current) => current + 1), 1800);
    return () => clearInterval(timer);
  }, []);
  const shown = [0, 1, 2].map((slot) => items[(tick + slot) % items.length]!);
  return (
    <div className={styles.visual} aria-hidden>
      <div className={styles.phone}>
        <div className={styles.notch} />
        <div className={`${styles.time} monospace`}>9:41</div>
        <div className={styles.notes}>
          {shown.map(([title, detail], slot) => (
            <div key={`${tick}-${slot}`} className={`${styles.note} ${styles[`note${slot}`] ?? ""}`}>
              <span className={styles.icon} />
              <span className={styles.text}>
                <b>{title}</b>
                <em>{detail}</em>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

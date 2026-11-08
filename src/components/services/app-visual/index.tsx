"use client";
import { useEffect, useState } from "react";
import { SERVICES } from "@/content/services";
import styles from "./index.module.scss";
import type { AppVisualProps } from "./type";

/** A phone with business notifications sliding in. */
export function AppVisual({ locale }: AppVisualProps) {
  const items = SERVICES.notifications[locale];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1800);
    return () => clearInterval(id);
  }, []);
  const shown = [0, 1, 2].map((k) => items[(tick + k) % items.length]!);
  return (
    <div className={styles.visual} aria-hidden>
      <div className={styles.phone}>
        <div className={styles.notch} />
        <div className={`${styles.time} mono`}>9:41</div>
        <div className={styles.notes}>
          {shown.map(([title, detail], k) => (
            <div key={`${tick}-${k}`} className={`${styles.note} ${styles[`note${k}`] ?? ""}`}>
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

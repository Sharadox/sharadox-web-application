"use client";
import { useSpotlight } from "@/hooks/spotlight";
import styles from "./index.module.scss";
import type { CardProperties } from "./type";

/** A service card with a pointer-following light on its surface and border. */
export function Card({ visual, tag, title, lead, text, wide }: CardProperties) {
  const spotlight = useSpotlight<HTMLElement>();
  return (
    <article ref={spotlight} className={[styles.card, wide && styles.wide].filter(Boolean).join(" ")}>
      <div className={styles.visual}>{visual}</div>
      <div className={styles.copy}>
        <span className={`monospace ${styles.tag}`}>{tag}</span>
        <h3>{title}</h3>
        <p className={styles.lead}>{lead}</p>
        <p>{text}</p>
      </div>
    </article>
  );
}

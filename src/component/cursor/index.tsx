"use client";
import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

/** Custom cursor on fine pointers: a dot plus a lagging ring that grows over links and the globe. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let frame = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target as HTMLElement;
      ring.current?.classList.toggle(styles.hot!, !!target.closest("a, button, input, textarea, label, [data-hot]"));
      ring.current?.classList.toggle(styles.grab!, !!target.closest("canvas"));
    };
    const loop = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    frame = requestAnimationFrame(loop);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
    };
  }, []);
  return (
    <>
      <div ref={ring} className={styles.ring} aria-hidden />
      <div ref={dot} className={styles.dot} aria-hidden />
    </>
  );
}

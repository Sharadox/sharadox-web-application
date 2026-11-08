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
    let rx = x;
    let ry = y;
    let id = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      ring.current?.classList.toggle(styles.hot!, !!t.closest("a, button, input, textarea, label, [data-hot]"));
      ring.current?.classList.toggle(styles.grab!, !!t.closest("canvas"));
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      id = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    id = requestAnimationFrame(loop);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(id);
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

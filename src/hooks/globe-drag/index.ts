"use client";
import { useEffect, useRef, useState } from "react";
import type { GlobeDrag } from "./type";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Drag-to-spin with inertia, a slow auto-rotation that eases back in after a drag,
 * and a small tilt towards the cursor. Attach the returned ref to the element that receives the pointer.
 */
export function useGlobeDrag(initial: { x: number; y: number }, autoRotate: boolean) {
  const target = useRef<HTMLDivElement>(null);
  const [drag] = useState(() => {
    const s = {
      rotX: initial.x,
      rotY: initial.y,
      velX: 0,
      velY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      idle: 0,
      tiltX: 0,
      tiltY: 0,
    };
    const controller: GlobeDrag & {
      down: (e: PointerEvent, el: HTMLElement) => void;
      move: (e: PointerEvent, el: HTMLElement) => void;
      up: () => void;
      leave: () => void;
    } = {
      down(e) {
        s.dragging = true;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
      },
      move(e, el) {
        const r = el.getBoundingClientRect();
        s.tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.18;
        s.tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.18;
        if (!s.dragging) return;
        const k = 2.6 / Math.max(r.width, 1);
        s.velY = (e.clientX - s.lastX) * k;
        s.velX = (e.clientY - s.lastY) * k;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        s.rotY += s.velY;
        s.rotX = clamp(s.rotX + s.velX, -0.9, 1.1);
        s.idle = 0;
      },
      up() {
        s.dragging = false;
      },
      leave() {
        s.tiltX = 0;
        s.tiltY = 0;
      },
      step(dt) {
        if (!s.dragging) {
          s.rotY += s.velY;
          s.rotX = clamp(s.rotX + s.velX, -0.9, 1.1);
          s.velY *= 0.94;
          s.velX *= 0.9;
          s.idle += dt;
          if (autoRotate) s.rotY += dt * 0.06 * Math.min(1, s.idle / 2);
        }
        return { x: s.rotX + s.tiltX, y: s.rotY + s.tiltY };
      },
    };
    return controller;
  });

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const down = (e: PointerEvent) => {
      drag.down(e, el);
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => drag.move(e, el);
    const up = (e: PointerEvent) => {
      drag.up();
      el.style.cursor = "grab";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", drag.leave);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", drag.leave);
    };
  }, [drag]);

  return [target, drag as GlobeDrag] as const;
}

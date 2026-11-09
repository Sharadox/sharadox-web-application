"use client";
import { useEffect, useRef, useState } from "react";
import type { GlobeDrag } from "./type";

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

/**
 * Drag-to-spin with inertia, a slow auto-rotation that eases back in after a drag,
 * and a small tilt towards the cursor. Attach the returned reference to the element that receives the pointer.
 */
export function useGlobeDrag(initial: { x: number; y: number }, autoRotate: boolean) {
  const target = useRef<HTMLDivElement>(null);
  const [drag] = useState(() => {
    const state = {
      rotationX: initial.x,
      rotationY: initial.y,
      velocityX: 0,
      velocityY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      idleSeconds: 0,
      tiltX: 0,
      tiltY: 0,
    };
    const controller: GlobeDrag & {
      down: (event: PointerEvent, element: HTMLElement) => void;
      move: (event: PointerEvent, element: HTMLElement) => void;
      up: () => void;
      leave: () => void;
    } = {
      down(event) {
        state.dragging = true;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
      },
      move(event, element) {
        const bounds = element.getBoundingClientRect();
        state.tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.18;
        state.tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.18;
        if (!state.dragging) return;
        const speed = 2.6 / Math.max(bounds.width, 1);
        state.velocityY = (event.clientX - state.lastX) * speed;
        state.velocityX = (event.clientY - state.lastY) * speed;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        state.rotationY += state.velocityY;
        state.rotationX = clamp(state.rotationX + state.velocityX, -0.9, 1.1);
        state.idleSeconds = 0;
      },
      up() {
        state.dragging = false;
      },
      leave() {
        state.tiltX = 0;
        state.tiltY = 0;
      },
      step(deltaSeconds) {
        if (!state.dragging) {
          state.rotationY += state.velocityY;
          state.rotationX = clamp(state.rotationX + state.velocityX, -0.9, 1.1);
          state.velocityY *= 0.94;
          state.velocityX *= 0.9;
          state.idleSeconds += deltaSeconds;
          if (autoRotate) state.rotationY += deltaSeconds * 0.06 * Math.min(1, state.idleSeconds / 2);
        }
        return { x: state.rotationX + state.tiltX, y: state.rotationY + state.tiltY };
      },
    };
    return controller;
  });

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const down = (event: PointerEvent) => {
      drag.down(event, element);
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };
    const move = (event: PointerEvent) => drag.move(event, element);
    const up = (event: PointerEvent) => {
      drag.up();
      element.style.cursor = "grab";
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    element.style.cursor = "grab";
    element.style.touchAction = "pan-y";
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("pointerleave", drag.leave);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("pointerleave", drag.leave);
    };
  }, [drag]);

  return [target, drag as GlobeDrag] as const;
}

"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { HOME } from "@/content/globe";
import { useGlobeDrag } from "@/hooks/globe-drag";
import { useLandPoints } from "@/hooks/land-points";
import { radians } from "@/utilities/radians";
import { supportsWebGl } from "@/utilities/web-gl-support";
import styles from "./index.module.scss";
import { World } from "./world";

/**
 * Interactive dot globe (default export so the hero can load it lazily).
 * Pauses rendering when off-screen and falls back to a static sphere without WebGL.
 */
export default function Globe() {
  const data = useLandPoints();
  const [visible, setVisible] = useState(true);
  // Client-only component (loaded without server rendering), so the browser APIs are safe here.
  const [webGl] = useState(supportsWebGl);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // Start over Europe/Africa; auto-rotation drifts west.
  const [wrapper, drag] = useGlobeDrag(
    { y: -radians(HOME.longitude) - 0.5, x: radians(HOME.latitude) * 0.62 },
    !reduced,
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      rootMargin: "100px",
    });
    if (wrapper.current) observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, [wrapper]);

  return (
    <div ref={wrapper} className={styles.globe}>
      <div className={styles.halo} aria-hidden />
      {webGl && data ? (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 3.7], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={visible ? "always" : "never"}
          aria-label="Interactive globe"
        >
          <World data={data} drag={drag} />
        </Canvas>
      ) : (
        <div className={styles.fallback} aria-hidden />
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

/** Loads the precomputed land dots (Float32 lat/lng pairs) for the globe. */
export function useLandPoints(url = "/globe/land.bin") {
  const [points, setPoints] = useState<Float32Array | null>(null);
  useEffect(() => {
    let live = true;
    fetch(url)
      .then((r) => r.arrayBuffer())
      .then((b) => live && setPoints(new Float32Array(b)));
    return () => {
      live = false;
    };
  }, [url]);
  return points;
}

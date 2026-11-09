"use client";
import { useEffect, useState } from "react";

/** Loads the precomputed land dots (Float32 latitude/longitude pairs) for the globe. */
export function useLandPoints(url = "/globe/land.bin") {
  const [points, setPoints] = useState<Float32Array | null>(null);
  useEffect(() => {
    let live = true;
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => live && setPoints(new Float32Array(buffer)));
    return () => {
      live = false;
    };
  }, [url]);
  return points;
}

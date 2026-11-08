import type { GlobeDrag } from "@/hooks/globe-drag/type";

export interface WorldProps {
  /** Float32 [lat, lng] land pairs. */
  data: Float32Array;
  /** Supplies the rotation each frame. */
  drag: GlobeDrag;
}

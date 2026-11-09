import type { GlobeDrag } from "@/hooks/globe-drag/type";

export interface WorldProperties {
  /** Float32 [latitude, longitude] land pairs. */
  data: Float32Array;
  /** Supplies the rotation each frame. */
  drag: GlobeDrag;
}

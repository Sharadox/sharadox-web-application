/** The rotation to apply this frame, in radians. */
export interface GlobeRotation {
  x: number;
  y: number;
}

/** Drag-to-spin controller for the globe. */
export interface GlobeDrag {
  /** Advances inertia and auto-rotation by `dt` seconds and returns the target rotation. */
  step: (dt: number) => GlobeRotation;
}

export interface ArcProperties {
  from: { latitude: number; longitude: number };
  to: readonly [number, number];
  /** Phase of the travelling pulse, 0–1, so arcs don't pulse in sync. */
  offset: number;
}

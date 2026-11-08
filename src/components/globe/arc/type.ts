export interface ArcProps {
  from: { lat: number; lng: number };
  to: readonly [number, number];
  /** Phase of the travelling pulse, 0–1, so arcs don't pulse in sync. */
  offset: number;
}

import type { HorizonDot } from "./type";

/** Dotted rows following the curve of a planet rising from the bottom of a 1200×630 share card. */
export function horizonDots(): HorizonDot[] {
  const dots: HorizonDot[] = [];
  for (let row = 1; row < 9; row++) {
    for (let column = 0; column < 90; column++) {
      const angle = Math.PI * (0.08 + (column / 89) * 0.84);
      const radiusX = 750 - row * 26;
      const radiusY = 550 - row * 26;
      const x = 600 + Math.cos(angle) * radiusX;
      const y = 970 - Math.sin(angle) * radiusY;
      if (y < 625) dots.push({ x, y, opacity: 0.55 - row * 0.05 });
    }
  }
  return dots;
}

import type { HorizonDot } from "./type";

/** Dotted rows following the curve of a planet rising from the bottom of a 1200×630 share card. */
export function horizonDots(): HorizonDot[] {
  const dots: HorizonDot[] = [];
  for (let row = 1; row < 9; row++) {
    for (let c = 0; c < 90; c++) {
      const a = Math.PI * (0.08 + (c / 89) * 0.84);
      const rx = 750 - row * 26;
      const ry = 550 - row * 26;
      const x = 600 + Math.cos(a) * rx;
      const y = 970 - Math.sin(a) * ry;
      if (y < 625) dots.push({ x, y, opacity: 0.55 - row * 0.05 });
    }
  }
  return dots;
}

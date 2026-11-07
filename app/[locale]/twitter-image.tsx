import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCALES, SITE, tr, type Locale } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sharadox";
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

/** Share card: black canvas, a dotted planet rising from the bottom, the slogan in Geist. */
export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const l = (await params).locale as Locale;
  const [semi, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/GeistMono-Regular.ttf")),
  ]);
  const dots: { x: number; y: number; o: number }[] = [];
  // dotted rows following the curve of the horizon (ellipse centred below the card)
  for (let r = 1; r < 9; r++) {
    for (let c = 0; c < 90; c++) {
      const a = Math.PI * (0.08 + (c / 89) * 0.84);
      const rx = 750 - r * 26, ry = 550 - r * 26;
      const x = 600 + Math.cos(a) * rx;
      const y = 970 - Math.sin(a) * ry;
      if (y < 625) dots.push({ x, y, o: 0.55 - r * 0.05 });
    }
  }
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#000", color: "#fff", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", left: -150, right: -150, top: 420, height: 1100, borderRadius: 9999, background: "#000", border: "1.5px solid rgba(255,255,255,0.55)", boxShadow: "0 -30px 140px rgba(255,255,255,0.22)", display: "flex" }} />
        {dots.map((d, i) => (
          <div key={i} style={{ position: "absolute", left: d.x, top: d.y, width: 3, height: 3, borderRadius: 3, background: `rgba(255,255,255,${d.o})`, display: "flex" }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist", fontSize: 30, letterSpacing: -0.5 }}>
          <div style={{ width: 22, height: 22, borderRadius: 22, border: "2px solid #fff", display: "flex" }} />
          Sharadox
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 70, fontFamily: "Geist", fontSize: 84, lineHeight: 1.02, letterSpacing: -2.6, maxWidth: 980 }}>
          {tr(SITE.slogan, l)}.
        </div>
        <div style={{ display: "flex", marginTop: 26, fontFamily: "GeistMono", fontSize: 22, color: "#8f8f8f" }}>sharadox.com</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: semi, weight: 600 }, { name: "GeistMono", data: mono, weight: 400 }] },
  );
}

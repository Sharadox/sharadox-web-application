import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/content/site";
import { horizonDots } from "@/utilities/horizon-dots";
import { translate } from "@/utilities/translate";
import type { ShareImageOptions } from "./type";

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

/** Share card (Open Graph and Twitter): black canvas, a dotted planet rising from the bottom, the slogan in Geist. */
export async function renderShareImage({ locale, width, height }: ShareImageOptions) {
  const [semiBold, mono] = await Promise.all([font("Geist-SemiBold.ttf"), font("GeistMono-Regular.ttf")]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        color: "#fff",
        padding: 72,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -150,
          right: -150,
          top: 420,
          height: 1100,
          borderRadius: 9999,
          background: "#000",
          border: "1.5px solid rgba(255,255,255,0.55)",
          boxShadow: "0 -30px 140px rgba(255,255,255,0.22)",
          display: "flex",
        }}
      />
      {horizonDots().map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: 3,
            height: 3,
            borderRadius: 3,
            background: `rgba(255,255,255,${d.opacity})`,
            display: "flex",
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Geist",
          fontSize: 30,
          letterSpacing: -0.5,
        }}
      >
        <div style={{ width: 22, height: 22, borderRadius: 22, border: "2px solid #fff", display: "flex" }} />
        Sharadox
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 70,
          fontFamily: "Geist",
          fontSize: 84,
          lineHeight: 1.02,
          letterSpacing: -2.6,
          maxWidth: 980,
        }}
      >
        {translate(SITE.slogan, locale)}.
      </div>
      <div style={{ display: "flex", marginTop: 26, fontFamily: "GeistMono", fontSize: 22, color: "#8f8f8f" }}>
        sharadox.com
      </div>
    </div>,
    {
      width,
      height,
      fonts: [
        { name: "Geist", data: semiBold, weight: 600 },
        { name: "GeistMono", data: mono, weight: 400 },
      ],
    },
  );
}

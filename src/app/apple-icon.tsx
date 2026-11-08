import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 96,
          border: "9px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 38,
            height: 78,
            borderRadius: 40,
            border: "6px solid rgba(255,255,255,.75)",
            display: "flex",
          }}
        />
      </div>
    </div>,
    size,
  );
}

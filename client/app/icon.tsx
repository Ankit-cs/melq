// app/icon.tsx
import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #18181b, #000000)",
        borderRadius: "18px",
        position: "relative",
      }}
    >
      {/* glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 60%)",
        }}
      />

      {/* M brand mark */}
      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          color: "#F3EEE3",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        M
      </div>

      {/* status dot */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: 8,
          height: 8,
          borderRadius: "9999px",
          background: "#D9541E",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}

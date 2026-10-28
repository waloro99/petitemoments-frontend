import { ImageResponse } from "next/og";

export const alt = "Petite Moments GT · Decoración con globos, sorpresas y eventos en Guatemala";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(140deg,#C0808C 0%,#B08968 100%)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, opacity: 0.9 }}>CIUDAD DE GUATEMALA</div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 16 }}>Petite Moments</div>
        <div style={{ fontSize: 40, marginTop: 20, maxWidth: 900, lineHeight: 1.3 }}>
          Globos, cake toppers, sorpresas, centros de mesa, juegos y detalles personalizados para tus celebraciones.
        </div>
      </div>
    ),
    size,
  );
}

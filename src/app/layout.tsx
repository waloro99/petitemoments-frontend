import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/JsonLd";
import { Footer, WhatsAppFloat } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { SITE } from "@/lib/config";
import { KEYWORDS, localBusinessLd } from "@/lib/seo";
import "./globals.css";

// Fuentes autohospedadas (sin CLS ni dependencia de Google Fonts en build).
const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
});

// Fuente de títulos grandes (spinwerad, licencia SIL OFL 1.1: ver fonts/spinwerad/OFL.txt).
// Rango de peso declarado para que el navegador no genere una "negrita falsa".
const spinwerad = localFont({
  variable: "--font-spinwerad",
  display: "swap",
  src: [{ path: "./fonts/spinwerad/spinwerad.woff2", weight: "100 900", style: "normal" }],
});

const mulish = localFont({
  variable: "--font-mulish",
  display: "swap",
  src: [
    { path: "./fonts/mulish-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/mulish-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/mulish-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/mulish-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/mulish-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Petite Moments GT · Decoración con globos y sorpresas en Guatemala",
    template: "%s · Petite Moments GT",
  },
  description: SITE.description,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "es_GT",
    siteName: SITE.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FAF5EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-GT" className={`${cormorant.variable} ${mulish.variable} ${spinwerad.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden">
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-lg bg-white px-4 py-2 font-bold text-blush focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <div id="contenido">{children}</div>
        <Footer />
        <WhatsAppFloat />
        <JsonLd data={localBusinessLd()} />
      </body>
    </html>
  );
}

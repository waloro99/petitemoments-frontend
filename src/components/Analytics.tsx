"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { analyticsEnabled, GA_ID, track, trackPageView } from "@/lib/analytics";

/**
 * Carga GA4 y Meta Pixel (si están configurados), registra cada página vista
 * —excepto /admin— y mide los clics a WhatsApp, correo e Instagram en todo el sitio.
 */
export function Analytics() {
  const pathname = usePathname();

  // Página vista en cada navegación (la carga inicial y los cambios de ruta del lado del cliente).
  useEffect(() => {
    if (!analyticsEnabled) return;
    // Espera un tick para que el <title> de la nueva ruta ya esté aplicado.
    const t = setTimeout(() => trackPageView(pathname), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  // Un solo listener para todos los enlaces de contacto del sitio.
  useEffect(() => {
    if (!analyticsEnabled) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || window.location.pathname.startsWith("/admin")) return;
      const href = a.href;
      const origen = a.dataset.track || window.location.pathname;
      if (href.includes("wa.me/") || href.includes("api.whatsapp.com")) track.whatsapp(origen, a.dataset.producto);
      else if (href.startsWith("mailto:")) track.email(origen);
      else if (href.includes("instagram.com")) track.instagram(origen);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // gtag.js procesa la cola de dataLayer al cargar; el Pixel se carga solo desde lib/analytics.
  if (!GA_ID) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`} strategy="afterInteractive" />;
}

/** Marca la vista de un producto (GA4 view_item / Meta ViewContent). */
export function TrackProductView({ slug, name, category }: { slug: string; name: string; category: string }) {
  useEffect(() => {
    if (!analyticsEnabled) return;
    const t = setTimeout(() => track.viewProduct({ slug, name, category }), 300);
    return () => clearTimeout(t);
  }, [slug, name, category]);
  return null;
}

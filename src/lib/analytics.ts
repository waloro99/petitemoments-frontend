// Analítica: Google Analytics 4 y Meta Pixel. Solo se activan si sus variables existen.
// NEXT_PUBLIC_* se incrusta en el build: tras cambiarlas en Vercel hay que redesplegar.

export const GA_ID = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();
export const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();
export const analyticsEnabled = Boolean(GA_ID || PIXEL_ID);

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { disablePushState?: boolean };
  }
}

/** Rutas que no se miden (el panel administrativo). */
export const isTrackedPath = (path: string) => !path.startsWith("/admin");

let gaReady = false;
let fbReady = false;

/** Cola de gtag: los comandos se guardan en dataLayer hasta que carga gtag.js (Analytics.tsx). */
function ga(...args: unknown[]) {
  if (!GA_ID || typeof window === "undefined") return;
  if (!gaReady) {
    gaReady = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag ||= function gtag() {
      // gtag.js espera el objeto `arguments`, no un arreglo
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
  }
  window.gtag!(...args);
}

/** Snippet oficial de Meta Pixel (cola + carga de fbevents.js), sin seguimiento automático de rutas. */
function fb(...args: unknown[]) {
  if (!PIXEL_ID || typeof window === "undefined") return;
  if (!fbReady) {
    fbReady = true;
    if (!window.fbq) {
      type Fbq = NonNullable<Window["fbq"]> & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push: unknown; loaded: boolean; version: string };
      const n = function (...a: unknown[]) {
        if (n.callMethod) n.callMethod(...a);
        else n.queue.push(a);
      } as Fbq;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      window.fbq = n;
      (window as unknown as { _fbq: Fbq })._fbq = n;
      const t = document.createElement("script");
      t.async = true;
      t.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(t);
    }
    window.fbq!.disablePushState = true; // las páginas vistas las mandamos nosotros
    window.fbq!("init", PIXEL_ID);
  }
  window.fbq!(...args);
}

export function trackPageView(path: string) {
  if (!isTrackedPath(path)) return;
  ga("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
  fb("track", "PageView");
}

/** Conversiones del sitio, con nombres estándar de GA4 y de Meta. */
export const track = {
  /** Clic en cualquier enlace de WhatsApp. */
  whatsapp(origen: string, producto?: string) {
    ga("event", "contacto_whatsapp", { origen, producto });
    fb("track", "Contact", { content_name: producto ?? origen, contact_method: "whatsapp" });
  },
  email(origen: string) {
    ga("event", "contacto_correo", { origen });
    fb("track", "Contact", { content_name: origen, contact_method: "email" });
  },
  instagram(origen: string) {
    ga("event", "clic_instagram", { origen });
  },
  /** Cotización enviada desde el formulario (lead real). */
  lead(p: { tipo: string; servicio: string; presupuesto: string; producto?: string }) {
    ga("event", "generate_lead", { tipo_evento: p.tipo, servicio: p.servicio, presupuesto: p.presupuesto, producto: p.producto });
    fb("track", "Lead", { content_name: p.producto ?? p.servicio, content_category: p.tipo });
  },
  viewProduct(p: { slug: string; name: string; category: string }) {
    ga("event", "view_item", { items: [{ item_id: p.slug, item_name: p.name, item_category: p.category }] });
    fb("track", "ViewContent", { content_ids: [p.slug], content_name: p.name, content_category: p.category, content_type: "product" });
  },
} satisfies Record<string, (...a: never[]) => void>;

export type { Params };

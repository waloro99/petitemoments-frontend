// Datos de negocio y catálogos fijos (ocasiones, estilos, presupuestos).
// Las categorías NO están aquí: son administrables desde el panel.

/** URL pública del sitio. Acepta valores sin "https://" y usa el dominio de Vercel si no se definió. */
function resolveSiteUrl(): string {
  const raw = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    ""
  ).trim();
  if (!raw) return "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE = {
  name: "Petite Moments GT",
  shortName: "Petite Moments",
  url: resolveSiteUrl(),
  description:
    "Decoración con globos, sorpresas personalizadas, repostería, fotografía e inflables para celebrar momentos especiales en Ciudad de Guatemala.",
  whatsapp: "50242278353",
  whatsappDisplay: "+502 4227-8353",
  // Placeholder: confirmar el correo real con la clienta.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@petitemomentsgt.com",
  instagram: "petitemomentsgt",
  city: "Ciudad de Guatemala",
  region: "Guatemala",
  country: "GT",
  hours: "Lun–Sáb · 9:00–19:00",
  coverage: "Ciudad de Guatemala y alrededores",
} as const;

export const OCCASIONS = {
  infantil: "Cumpleaños infantil",
  adulto: "Cumpleaños adulto",
  babyshower: "Baby shower",
  gender: "Gender reveal",
  aniversario: "Aniversario",
  graduacion: "Graduación",
  bautizo: "Bautizo",
  corporativo: "Corporativo",
  romantica: "Sorpresa romántica",
} as const;

export const STYLES = {
  elegante: "Elegante",
  infantil: "Infantil",
  pastel: "Pastel",
  colorido: "Colorido",
  minimalista: "Minimalista",
  tematico: "Temático",
  corporativo: "Corporativo",
} as const;

export const BUDGETS = {
  economico: "Económico",
  medio: "Medio",
  premium: "Premium",
  cotizar: "A cotizar",
} as const;

export const BADGES = ["Más cotizado", "Nuevo", "Temporada", "Promoción", "Destacado"] as const;

export type OccasionKey = keyof typeof OCCASIONS;
export type StyleKey = keyof typeof STYLES;
export type BudgetKey = keyof typeof BUDGETS;

export const occLabel = (k: string) => (OCCASIONS as Record<string, string>)[k] ?? k;
export const styleLabel = (k: string) => (STYLES as Record<string, string>)[k] ?? k;
export const budgetLabel = (k: string) => (BUDGETS as Record<string, string>)[k] ?? k;

// Opciones del formulario de cotización
export const QUOTE_OPTIONS = {
  tipo: [
    "Cumpleaños infantil",
    "Cumpleaños adulto",
    "Baby shower",
    "Gender reveal",
    "Aniversario",
    "Graduación",
    "Bautizo / primera comunión",
    "Evento corporativo",
    "Sorpresa romántica",
    "Otro",
  ],
  lugar: ["Casa", "Salón", "Restaurante", "Oficina", "Exterior", "Interior"],
  servicio: [
    "Decoración",
    "Sorpresa",
    "Repostería",
    "Fotografía",
    "Inflable",
    "Paquete completo",
    "No estoy seguro/a",
  ],
  estilo: ["Elegante", "Infantil", "Temático", "Pastel", "Colorido", "Minimalista", "Corporativo", "Otro"],
  presupuesto: ["Prefiero que me orienten", "Económico", "Medio", "Premium"],
  contacto: ["WhatsApp", "Correo", "Ambos"],
} as const;

import { SITE } from "./config";

export const waLink = (text: string, phone: string = SITE.whatsapp) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

export const WA_MSG = {
  general: "Hola Petite Moments, quiero cotizar un evento. ¿Me pueden ayudar?",
  floating: "Hola Petite Moments, vi su página web y quiero hacer una consulta.",
  product: (name: string) =>
    `Hola Petite Moments, vi en la página web el producto "${name}". Me gustaría cotizarlo. Mi evento será el [fecha] en [zona].`,
  gallery: (title: string) =>
    `Hola Petite Moments, vi una decoración en la galería ("${title}") y quiero algo similar. ¿Me pueden ayudar a cotizar?`,
};

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const productMailto = (name: string) =>
  mailtoLink(
    `Cotización: ${name}`,
    `Hola Petite Moments, me gustaría cotizar el producto "${name}".\n\nFecha del evento:\nZona/municipio:\nEstilo deseado:\nComentarios:`,
  );

export type QuoteFormData = {
  nombre: string;
  whatsapp: string;
  correo: string;
  fecha: string;
  hora: string;
  tipo: string;
  invitados: string;
  zona: string;
  lugar: string;
  servicio: string;
  estilo: string;
  presupuesto: string;
  comentarios: string;
  contacto: string;
  producto?: string;
};

export function buildQuoteMessage(f: QuoteFormData): string {
  let m = "Hola Petite Moments, quiero cotizar un evento.\n";
  if (f.producto) m += `\n• Producto de interés: ${f.producto}`;
  m += `\n• Nombre: ${f.nombre || "—"}`;
  m += `\n• Tipo de evento: ${f.tipo}`;
  m += `\n• Fecha: ${f.fecha || "por definir"}${f.hora ? ` · ${f.hora}` : ""}`;
  m += `\n• Ubicación: ${f.zona || "—"} (${f.lugar})`;
  m += `\n• Invitados: ${f.invitados || "—"}`;
  m += `\n• Servicio: ${f.servicio}`;
  m += `\n• Estilo: ${f.estilo}`;
  m += `\n• Presupuesto: ${f.presupuesto}`;
  if (f.comentarios) m += `\n• Comentarios: ${f.comentarios}`;
  return m;
}

/** Normaliza un número guatemalteco a formato wa.me (502XXXXXXXX). */
export function toWaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) return `502${digits}`;
  return digits;
}

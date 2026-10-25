"use server";

import { updateTag } from "next/cache";
import { QUOTE_OPTIONS, SITE } from "@/lib/config";
import { CATALOG_TAG } from "@/lib/data";
import { clean, escapeHtml, visitorHash } from "@/lib/security";
import { serviceClient } from "@/lib/supabase/clients";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { buildQuoteMessage, type QuoteFormData } from "@/lib/whatsapp";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/* ---------------------------------------------------------------- Reseñas */

export type ReviewInput = { productId: string; name: string; stars: number; text: string; website?: string };

/**
 * Regla central: con 4★ o más se publica al instante; con menos queda pendiente.
 * El estado se decide AQUÍ y además lo fuerza un trigger en Postgres (defensa en profundidad).
 */
export async function submitReview(input: ReviewInput): Promise<Result<{ status: "published" | "pending" }>> {
  // Honeypot anti-bots: si viene relleno, fingimos éxito sin guardar.
  if (input.website) return { ok: true, status: "pending" };

  const name = clean(input.name, 60);
  const text = clean(input.text, 1200);
  const stars = Math.round(Number(input.stars));
  if (!name || !text) return { ok: false, error: "Escribe tu nombre y tu experiencia." };
  if (!(stars >= 1 && stars <= 5)) return { ok: false, error: "Elige una calificación de 1 a 5 estrellas." };
  if (text.length < 8) return { ok: false, error: "Cuéntanos un poco más sobre tu experiencia." };

  const status = stars >= 4 ? "published" : "pending";
  if (!isSupabaseConfigured) return { ok: true, status }; // modo demo: no se persiste

  const db = serviceClient();
  if (!db) return { ok: false, error: "El servidor no tiene configurada la clave secreta de Supabase." };

  const ipHash = await visitorHash();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await db.from("reviews").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= 3) return { ok: false, error: "Recibimos varias reseñas desde tu conexión. Intenta más tarde." };

  const { data: product } = await db.from("products").select("id").eq("id", input.productId).eq("active", true).maybeSingle();
  if (!product) return { ok: false, error: "Producto no encontrado." };

  const { data, error } = await db
    .from("reviews")
    .insert({ product_id: product.id, name, stars, body: text, status, ip_hash: ipHash })
    .select("status")
    .single();
  if (error) return { ok: false, error: "No pudimos guardar tu reseña. Intenta de nuevo." };

  if (data.status === "published") updateTag(CATALOG_TAG);
  return { ok: true, status: data.status };
}

/* ---------------------------------------------------------------- Cotizaciones (leads) */

const pick = (v: string, list: readonly string[], fallback: string) => (list.includes(v) ? v : fallback);

export async function submitLead(raw: QuoteFormData & { website?: string }): Promise<Result<{ stored: boolean }>> {
  if (raw.website) return { ok: true, stored: false };

  const f: QuoteFormData = {
    nombre: clean(raw.nombre, 100),
    whatsapp: clean(raw.whatsapp, 30),
    correo: clean(raw.correo, 120),
    fecha: clean(raw.fecha, 10),
    hora: clean(raw.hora, 5),
    tipo: pick(clean(raw.tipo, 60), QUOTE_OPTIONS.tipo, "Otro"),
    invitados: clean(raw.invitados, 30),
    zona: clean(raw.zona, 100),
    lugar: pick(clean(raw.lugar, 30), QUOTE_OPTIONS.lugar, "Casa"),
    servicio: pick(clean(raw.servicio, 40), QUOTE_OPTIONS.servicio, "No estoy seguro/a"),
    estilo: pick(clean(raw.estilo, 30), QUOTE_OPTIONS.estilo, "Otro"),
    presupuesto: pick(clean(raw.presupuesto, 40), QUOTE_OPTIONS.presupuesto, "Prefiero que me orienten"),
    comentarios: clean(raw.comentarios, 2000),
    contacto: pick(clean(raw.contacto, 20), QUOTE_OPTIONS.contacto, "WhatsApp"),
    producto: clean(raw.producto, 120),
  };

  if (!f.nombre) return { ok: false, error: "Escribe tu nombre completo." };
  if (f.whatsapp.replace(/\D/g, "").length < 8) return { ok: false, error: "Escribe un número de WhatsApp válido (8 dígitos)." };
  if (f.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) return { ok: false, error: "Revisa el formato del correo." };
  if (f.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(f.fecha)) f.fecha = "";
  if (f.hora && !/^\d{2}:\d{2}$/.test(f.hora)) f.hora = "";

  if (!isSupabaseConfigured) return { ok: true, stored: false }; // modo demo

  const db = serviceClient();
  if (!db) return { ok: false, error: "El servidor no tiene configurada la clave secreta de Supabase." };

  const ipHash = await visitorHash();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await db.from("leads").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= 5) return { ok: false, error: "Recibimos varias solicitudes desde tu conexión. Escríbenos por WhatsApp." };

  const { error } = await db.from("leads").insert({
    nombre: f.nombre,
    whatsapp: f.whatsapp,
    correo: f.correo || null,
    fecha: f.fecha || null,
    hora: f.hora || null,
    tipo: f.tipo,
    invitados: f.invitados || null,
    zona: f.zona || null,
    lugar: f.lugar,
    servicio: f.servicio,
    estilo: f.estilo,
    presupuesto: f.presupuesto,
    comentarios: f.comentarios || null,
    contacto: f.contacto,
    product_slug: f.producto || null,
    ip_hash: ipHash,
  });
  if (error) return { ok: false, error: "No pudimos guardar tu solicitud. Escríbenos por WhatsApp." };

  await notifyByEmail(f).catch((e) => console.error("[lead] correo no enviado:", e));
  return { ok: true, stored: true };
}

/** Aviso al negocio vía Resend (opcional: si no hay API key, se omite). */
async function notifyByEmail(f: QuoteFormData) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL || SITE.email;
  if (!key) return;
  const from = process.env.RESEND_FROM || "Petite Moments <onboarding@resend.dev>";
  const rows = buildQuoteMessage(f).split("\n").filter((l) => l.startsWith("•"));
  const waReply = `https://wa.me/${f.whatsapp.replace(/\D/g, "").length === 8 ? "502" : ""}${f.whatsapp.replace(/\D/g, "")}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#3D3330;max-width:560px">
      <h2 style="color:#B0606C;margin:0 0 12px">Nueva solicitud de cotización</h2>
      <ul style="padding-left:18px;line-height:1.6">${rows.map((r) => `<li>${escapeHtml(r.slice(2))}</li>`).join("")}</ul>
      <p>WhatsApp: <strong>${escapeHtml(f.whatsapp)}</strong>${f.correo ? ` · Correo: ${escapeHtml(f.correo)}` : ""} · Prefiere: ${escapeHtml(f.contacto)}</p>
      <p><a href="${waReply}" style="background:#25D366;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:bold">Responder por WhatsApp</a></p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: f.correo || undefined,
      subject: `Cotización: ${f.tipo} — ${f.nombre}`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

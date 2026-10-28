import { connection } from "next/server";
import { checkStorage, checkStorageWrite } from "@/lib/storage";
import { publicClient, serviceClient } from "@/lib/supabase/clients";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Diagnóstico de servicios. Solo devuelve estados (sí/no y códigos), nunca valores secretos. */
export async function GET(request: Request) {
  await connection();
  const out: Record<string, unknown> = { supabaseConfigurado: isSupabaseConfigured };

  if (isSupabaseConfigured) {
    const pub = await publicClient().from("products").select("id", { count: "exact", head: true });
    out.lecturaPublica = pub.error ? `error: ${pub.error.message}` : `ok (${pub.count} productos)`;
    const svc = serviceClient();
    if (!svc) out.claveSecreta = "falta SUPABASE_SECRET_KEY";
    else {
      const leads = await svc.from("leads").select("id", { count: "exact", head: true });
      out.claveSecreta = leads.error ? `error: ${leads.error.message}` : `ok (${leads.count} cotizaciones)`;
    }
  }

  out.imagenes = await checkStorage();

  // Correo de avisos (Resend): solo indica si está configurado y desde qué dominio sale.
  const from = process.env.RESEND_FROM || "";
  out.correoAvisos = process.env.RESEND_API_KEY
    ? `configurado (remitente @${from.match(/@([^>\s]+)/)?.[1] ?? "?"})`
    : "sin RESEND_API_KEY: las cotizaciones se guardan pero no avisan por correo";

  out.analitica = {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID ? "configurado" : "falta NEXT_PUBLIC_GA_ID",
    metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ? "configurado" : "falta NEXT_PUBLIC_META_PIXEL_ID",
    searchConsole: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? "etiqueta configurada" : "sin etiqueta (no hace falta si se verificó por DNS)",
  };
  // ?escritura=1 hace una prueba real de subida/borrado en R2
  if (new URL(request.url).searchParams.get("escritura") === "1") out.pruebaEscritura = await checkStorageWrite(new URL(request.url).origin);
  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}

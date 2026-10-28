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
  // ?escritura=1 hace una prueba real de subida/borrado en R2
  if (new URL(request.url).searchParams.get("escritura") === "1") out.pruebaEscritura = await checkStorageWrite();
  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}

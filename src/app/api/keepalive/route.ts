import { connection } from "next/server";
import { publicClient } from "@/lib/supabase/clients";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Consulta mínima diaria (cron de Vercel) para que Supabase no pause el proyecto gratis
 * por inactividad (lo hace tras 7 días sin uso).
 */
export async function GET(request: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("No autorizado", { status: 401 });
  }
  if (!isSupabaseConfigured) return Response.json({ ok: true, demo: true });
  const { error } = await publicClient().from("categories").select("key", { count: "exact", head: true });
  return Response.json({ ok: !error }, { status: error ? 500 : 200 });
}

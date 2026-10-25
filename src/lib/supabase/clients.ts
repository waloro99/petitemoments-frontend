import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./env";

/** Cliente anónimo sin cookies: lecturas públicas cacheables (RLS aplica). */
export function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cliente con la clave secreta (service role). Solo servidor.
 * Se usa para escrituras públicas controladas (leads, reseñas) con validación y rate limit propios.
 */
export function serviceClient() {
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!SUPABASE_URL || !secret) return null;
  return createClient(SUPABASE_URL, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

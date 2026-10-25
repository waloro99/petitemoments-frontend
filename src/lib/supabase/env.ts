// Variables de entorno de Supabase. Se aceptan los nombres nuevos (publishable/secret)
// y los clásicos (anon/service_role).
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
export const SUPABASE_PUBLIC_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ""
).trim();

function isValidSupabaseUrl(u: string) {
  if (!u || /x{6,}|tu-proyecto|your-project/i.test(u)) return false; // valores de ejemplo
  try {
    const url = new URL(u);
    return url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Solo se considera configurado si la URL es válida y hay una clave pública real.
 * Si no, el sitio corre en MODO DEMO con los datos semilla (no falla el build ni el sitio).
 */
export const isSupabaseConfigured = isValidSupabaseUrl(SUPABASE_URL) && SUPABASE_PUBLIC_KEY.length >= 20;

export const STORAGE_BUCKET = "media";

// Variables de entorno de Supabase. Se aceptan los nombres nuevos (publishable/secret)
// y los clásicos (anon/service_role).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Sin URL y clave pública, el sitio corre en modo demo con los datos semilla. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLIC_KEY);

export const STORAGE_BUCKET = "media";

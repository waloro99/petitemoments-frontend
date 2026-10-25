import "server-only";
import { sessionClient } from "./supabase/clients";
import { isSupabaseConfigured } from "./supabase/env";

export type AdminUser = { id: string; email: string };

/**
 * Devuelve el admin actual o null. Verifica el JWT con Supabase (getUser) y que el
 * usuario esté en la lista blanca `admin_users`. Lee cookies: llamar dentro de <Suspense>.
 */
export async function getAdmin(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured) return null;
  const sb = await sessionClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { id: user.id, email: user.email ?? "" } : null;
}

export class AuthError extends Error {}

/** Para Server Actions: cada acción se autoriza por sí misma, nunca confía en el cliente. */
export async function requireAdmin() {
  if (!isSupabaseConfigured) throw new AuthError("Modo demo: conecta Supabase para guardar cambios.");
  const admin = await getAdmin();
  if (!admin) throw new AuthError("Tu sesión expiró. Vuelve a ingresar.");
  return { admin, db: await sessionClient() };
}

import "server-only";
import { scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD_HASH, ADMIN_USERNAME, SESSION_COOKIE, verifySessionToken } from "./admin-session";
import { serviceClient } from "./supabase/clients";
import { isSupabaseConfigured } from "./supabase/env";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

export type AdminUser = { username: string };

/** Admin actual según la cookie firmada, o null. Lee cookies: llamar dentro de <Suspense>. */
export async function getAdmin(): Promise<AdminUser | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Verifica usuario y contraseña contra el hash scrypt (comparación en tiempo constante). */
export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const [algo, n, r, p, saltB64, hashB64] = ADMIN_PASSWORD_HASH.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const got = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  });
  const userOk = username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase();
  return timingSafeEqual(got, expected) && userOk;
}

export class AuthError extends Error {}

/**
 * Para Server Actions: cada acción se autoriza por sí misma (cookie firmada) y escribe en la base
 * con la clave secreta del servidor. Nunca confía en el cliente.
 */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new AuthError("Tu sesión expiró. Vuelve a ingresar.");
  if (!isSupabaseConfigured) throw new AuthError("Modo demo: conecta la base de datos (Supabase) para guardar cambios.");
  const db = serviceClient();
  if (!db) throw new AuthError("Falta SUPABASE_SECRET_KEY en las variables de entorno del servidor.");
  return { admin, db };
}

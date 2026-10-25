// Sesión del panel: cookie httpOnly firmada con HMAC-SHA256 (Web Crypto: funciona en el proxy y en el servidor).
import { BUILD_SESSION_SECRET } from "./generated/build-secret";

export const SESSION_COOKIE = "pm_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/** Usuario por defecto. Se cambia con ADMIN_USERNAME. */
export const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").trim();

/**
 * Hash scrypt de la contraseña por defecto (la contraseña en claro NO está en el código).
 * Se cambia con ADMIN_PASSWORD_HASH (genera uno con `npm run admin:password -- "nueva"`).
 */
export const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH || "scrypt$32768$8$1$103vimDgG2ejDAkLkcNxSg==$bQox+WgyYhoR/U7vVjwtYvF1YFsQzpsfCHfSCl9c4bc=";

const secret = () => process.env.ADMIN_SESSION_SECRET || BUILD_SESSION_SECRET;

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })));
  return `${payload}.${b64url(await hmac(payload))}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<{ username: string } | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    if (!safeEqual(fromB64url(sig), await hmac(payload))) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { u: string; exp: number };
    if (!data.exp || data.exp < Date.now() / 1000) return null;
    if (data.u !== ADMIN_USERNAME) return null; // si cambia el usuario, las sesiones viejas dejan de valer
    return { username: data.u };
  } catch {
    return null;
  }
}

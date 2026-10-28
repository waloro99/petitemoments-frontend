import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AwsClient } from "aws4fetch";
import { STORAGE_BUCKET } from "./supabase/env";

/**
 * Almacenamiento de imágenes.
 * - Si las variables R2_* están definidas → Cloudflare R2 (10 GB gratis, sin costo de salida).
 * - Si no → Supabase Storage (bucket "media", 1 GB en el plan gratis).
 */
const R2 = {
  accountId: process.env.R2_ACCOUNT_ID?.trim() ?? "",
  accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim() ?? "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim() ?? "",
  bucket: process.env.R2_BUCKET?.trim() ?? "",
  publicUrl: (process.env.R2_PUBLIC_URL ?? "").trim().replace(/\/+$/, ""),
};

export const isR2Configured = Boolean(R2.accountId && R2.accessKeyId && R2.secretAccessKey && R2.bucket && R2.publicUrl.startsWith("https://"));

let client: AwsClient | null = null;
const r2 = () => (client ??= new AwsClient({ accessKeyId: R2.accessKeyId, secretAccessKey: R2.secretAccessKey, service: "s3", region: "auto" }));
// R2_ENDPOINT solo para pruebas locales; en producción se usa el endpoint de la cuenta.
const r2Base = () => (process.env.R2_ENDPOINT || `https://${R2.accountId}.r2.cloudflarestorage.com`).replace(/\/+$/, "");
const r2Endpoint = (key: string) => `${r2Base()}/${R2.bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;

/**
 * PUT firmado con el cuerpo como bytes y longitud explícita.
 * (Pasarle un Request a fetch hace que Next.js lo envíe como stream sin Content-Length,
 * y R2 lo rechaza con 411 MissingContentLength.)
 */
async function r2Put(key: string, bytes: ArrayBuffer, contentType: string) {
  const signed = await r2().sign(r2Endpoint(key), {
    method: "PUT",
    body: bytes,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
  return fetch(signed.url, { method: "PUT", headers: signed.headers, body: bytes, cache: "no-store" });
}

/** Sube un archivo y devuelve su URL pública. */
export async function putImage(db: SupabaseClient, key: string, file: Blob, contentType: string): Promise<string> {
  if (isR2Configured) {
    const res = await r2Put(key, await file.arrayBuffer(), contentType);
    if (!res.ok) throw new Error(`R2 respondió ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return `${R2.publicUrl}/${key}`;
  }
  const { error } = await db.storage.from(STORAGE_BUCKET).upload(key, file, { contentType, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return db.storage.from(STORAGE_BUCKET).getPublicUrl(key).data.publicUrl;
}

/** Borra imágenes por URL (R2 o Supabase). Ignora placeholders y URLs ajenas. */
export async function deleteImages(db: SupabaseClient, urls: string[]) {
  const supabaseMarker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const supabasePaths: string[] = [];
  for (const url of urls) {
    if (isR2Configured && url.startsWith(`${R2.publicUrl}/`)) {
      const key = decodeURIComponent(url.slice(R2.publicUrl.length + 1));
      const res = await r2().fetch(r2Endpoint(key), { method: "DELETE" });
      if (!res.ok && res.status !== 404) console.error(`[storage] No se pudo borrar ${key} en R2: ${res.status}`);
      continue;
    }
    const i = url.indexOf(supabaseMarker);
    if (i >= 0) supabasePaths.push(decodeURIComponent(url.slice(i + supabaseMarker.length)));
  }
  if (supabasePaths.length) await db.storage.from(STORAGE_BUCKET).remove(supabasePaths);
}

/** Verifica credenciales de R2 (listado de 1 objeto) y que el dominio público responda. */
export async function checkStorage(): Promise<Record<string, unknown>> {
  if (!isR2Configured) return { proveedor: "supabase", nota: "R2 no configurado o incompleto" };
  const out: Record<string, unknown> = { proveedor: "r2", dominioPublico: R2.publicUrl };
  try {
    const res = await r2().fetch(`${r2Base()}/${R2.bucket}?list-type=2&max-keys=1`);
    out.credenciales = res.ok ? "ok" : `error ${res.status}: ${(await res.text()).replace(/\s+/g, " ").slice(0, 160)}`;
  } catch (e) {
    out.credenciales = `error: ${e instanceof Error ? e.message : String(e)}`;
  }
  try {
    const res = await fetch(`${R2.publicUrl}/__health-check-inexistente.txt`, { cache: "no-store" });
    // 404 = el dominio está conectado al bucket (el archivo no existe, es lo esperado)
    out.dominio = res.status === 404 ? "ok (conectado)" : `respondió ${res.status}`;
  } catch (e) {
    out.dominio = `no responde: ${e instanceof Error ? e.message : String(e)}`;
  }
  return out;
}

/** Prueba real de escritura: sube y borra un archivo diminuto en R2. */
export async function checkStorageWrite(siteOrigin?: string): Promise<string> {
  if (!isR2Configured) return "R2 no configurado";
  const key = `__health-check-${Date.now()}.txt`;
  const put = await r2Put(key, new TextEncoder().encode("ok").buffer as ArrayBuffer, "text/plain");
  if (!put.ok) return `error al subir ${put.status}: ${(await put.text()).replace(/\s+/g, " ").slice(0, 200)}`;
  const pub = await fetch(`${R2.publicUrl}/${key}`, { cache: "no-store" });
  let optim = "";
  if (siteOrigin) {
    // Sube además una imagen mínima y la pide por el optimizador de Next (/_next/image)
    const png = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="), (c) => c.charCodeAt(0));
    const imgKey = `__health-check-${Date.now()}.png`;
    await r2Put(imgKey, png.buffer as ArrayBuffer, "image/png");
    const img = await fetch(`${siteOrigin}/_next/image?url=${encodeURIComponent(`${R2.publicUrl}/${imgKey}`)}&w=64&q=75`, { cache: "no-store" });
    optim = ` · optimizador de imágenes ${img.ok ? "ok" : img.status}`;
    await r2().fetch(r2Endpoint(imgKey), { method: "DELETE" });
  }
  const del = await r2().fetch(r2Endpoint(key), { method: "DELETE" });
  return `subida ok · lectura pública ${pub.ok ? "ok" : pub.status} · borrado ${del.ok ? "ok" : del.status}${optim}`;
}

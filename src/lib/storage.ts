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
const r2Endpoint = (key: string) =>
  `https://${R2.accountId}.r2.cloudflarestorage.com/${R2.bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;

/** Sube un archivo y devuelve su URL pública. */
export async function putImage(db: SupabaseClient, key: string, file: Blob, contentType: string): Promise<string> {
  if (isR2Configured) {
    const res = await r2().fetch(r2Endpoint(key), {
      method: "PUT",
      body: await file.arrayBuffer(),
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
    });
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
    const res = await r2().fetch(`https://${R2.accountId}.r2.cloudflarestorage.com/${R2.bucket}?list-type=2&max-keys=1`);
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

"use client";
import { browserClient } from "./supabase/browser";
import { STORAGE_BUCKET } from "./supabase/env";

/**
 * Reduce la foto en el navegador (máx. 2000 px, WebP) y la sube a Supabase Storage.
 * Las políticas de Storage solo permiten escribir a administradores.
 */
export async function uploadImage(file: File, folder: "products" | "gallery", baseName: string) {
  const { blob, width, height } = await toWebp(file, 2000, 0.85);
  const name = `${folder}/${slug(baseName) || "foto"}-${crypto.randomUUID().slice(0, 8)}.webp`;
  const sb = browserClient();
  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(name, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(name);
  return { url: data.publicUrl, width, height };
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);

async function toWebp(file: File, max: number, quality: number) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * scale);
  const height = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, width, height);
  bmp.close();
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("No se pudo procesar la imagen."))), "image/webp", quality),
  );
  return { blob, width, height };
}

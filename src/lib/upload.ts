"use client";
import { uploadAdminImage } from "@/app/admin/actions";

/**
 * Reduce la foto en el navegador (máx. 2000 px, WebP) y la sube por el servidor
 * (Server Action verificada con la sesión del panel) al bucket "media" de Supabase.
 */
export async function uploadImage(file: File, folder: "products" | "gallery", baseName: string) {
  let { blob, width, height } = await toWebp(file, 2000, 0.85);
  if (blob.size > 3.5 * 1024 * 1024) ({ blob, width, height } = await toWebp(file, 1600, 0.75));
  const fd = new FormData();
  fd.append("file", new File([blob], "foto.webp", { type: blob.type || "image/webp" }));
  fd.append("folder", folder);
  fd.append("name", baseName);
  const res = await uploadAdminImage(fd);
  if (!res.ok) throw new Error(res.error);
  return { url: res.url, width, height };
}

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

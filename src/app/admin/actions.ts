"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-session";
import { BADGES, BUDGETS, OCCASIONS, STYLES } from "@/lib/config";
import { CATALOG_TAG } from "@/lib/data";
import { fromProduct } from "@/lib/db-map";
import { AuthError, checkCredentials, requireAdmin } from "@/lib/auth";
import { clean } from "@/lib/security";
import { slugify } from "@/lib/seed";
import { deleteImages, putImage } from "@/lib/storage";
import type { Product } from "@/lib/types";

type Res<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** Envuelve cada acción: autoriza, captura errores y devuelve un mensaje legible. */
async function guarded<T extends object>(fn: (db: Awaited<ReturnType<typeof requireAdmin>>["db"]) => Promise<T>): Promise<Res<T>> {
  try {
    const { db } = await requireAdmin();
    const out = await fn(db);
    return { ok: true, ...out };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message };
    console.error("[admin]", e);
    return { ok: false, error: e instanceof Error ? e.message : "Ocurrió un error inesperado." };
  }
}

const must = <T,>(r: { data: T; error: { message: string } | null }) => {
  if (r.error) throw new Error(r.error.message);
  return r.data;
};

/* ------------------------------------------------------------------ Sesión */

export async function signIn(_: unknown, form: FormData): Promise<{ error?: string }> {
  const username = clean(form.get("username"), 80);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!username || !password) return { error: "Escribe tu usuario y contraseña." };

  const ok = await checkCredentials(username, password);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // frena intentos por fuerza bruta
    return { error: "Usuario o contraseña incorrectos. Intenta de nuevo." };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(username.toLowerCase()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ Storage */

type Db = Awaited<ReturnType<typeof requireAdmin>>["db"];

const removeFiles = (db: Db, urls: string[]) => deleteImages(db, urls);

const ALLOWED_TYPES = ["image/webp", "image/jpeg", "image/png", "image/avif"];

/** Sube una imagen (ya reducida en el navegador) al bucket público "media". */
export async function uploadAdminImage(form: FormData): Promise<Res<{ url: string }>> {
  return guarded(async (db) => {
    const file = form.get("file");
    const folder = form.get("folder") === "gallery" ? "gallery" : "products";
    const base = slugify(clean(form.get("name"), 60)) || "foto";
    if (!(file instanceof File) || file.size === 0) throw new Error("No llegó ninguna imagen.");
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Formato no permitido. Usa JPG, PNG o WebP.");
    if (file.size > 4 * 1024 * 1024) throw new Error("La imagen pesa más de 4 MB.");
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const path = `${folder}/${base}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    return { url: await putImage(db, path, file, file.type) };
  });
}

/** Borra fotos subidas que no llegaron a guardarse (al cancelar la edición). */
export async function discardUploads(urls: string[]): Promise<Res> {
  return guarded(async (db) => {
    const list = (Array.isArray(urls) ? urls : []).filter((u) => typeof u === "string").slice(0, 20);
    // Solo se borran si ningún producto o foto de galería las usa.
    const { data: used } = await db.from("products").select("images").overlaps("images", list);
    const usedSet = new Set((used ?? []).flatMap((r: { images: string[] }) => r.images));
    const { data: usedG } = await db.from("gallery_items").select("image_url").in("image_url", list);
    (usedG ?? []).forEach((r: { image_url: string }) => usedSet.add(r.image_url));
    await removeFiles(db, list.filter((u) => !usedSet.has(u)));
    return {};
  });
}

/* ------------------------------------------------------------------ Productos */

export type ProductDraft = Omit<Product, "slug" | "id"> & { id: string | null; slug?: string };

const lines = (a: unknown, max = 20) =>
  (Array.isArray(a) ? a : [])
    .map((x) => clean(x, 160))
    .filter(Boolean)
    .slice(0, max);

export async function saveProduct(d: ProductDraft): Promise<Res<{ id: string; slug: string }>> {
  return guarded(async (db) => {
    const name = clean(d.name, 120);
    if (!name) throw new Error("El nombre es obligatorio.");
    const cat = clean(d.cat, 60);
    const occKeys = Object.keys(OCCASIONS);
    const styleKeys = Object.keys(STYLES);

    let slug = d.slug && d.id ? d.slug : slugify(name) || `producto-${Date.now()}`;
    if (!d.id) {
      // Slug único para productos nuevos
      const { data: taken } = await db.from("products").select("slug").like("slug", `${slug}%`);
      const set = new Set((taken ?? []).map((t: { slug: string }) => t.slug));
      if (set.has(slug)) {
        let n = 2;
        while (set.has(`${slug}-${n}`)) n++;
        slug = `${slug}-${n}`;
      }
    }

    const record = fromProduct({
      slug,
      name,
      cat,
      occ: lines(d.occ).filter((k) => occKeys.includes(k)),
      style: lines(d.style).filter((k) => styleKeys.includes(k)),
      budget: (Object.keys(BUDGETS).includes(d.budget) ? d.budget : "cotizar") as Product["budget"],
      priceLabel: clean(d.priceLabel, 40) || "A cotizar",
      badge: d.badge && (BADGES as readonly string[]).includes(d.badge) ? d.badge : null,
      blurb: clean(d.blurb, 220),
      longDesc: clean(d.longDesc, 2000),
      recomendado: clean(d.recomendado, 220),
      incluye: lines(d.incluye),
      personalizable: lines(d.personalizable),
      opcionales: lines(d.opcionales),
      tiempo: clean(d.tiempo, 80),
      images: lines(d.images, 12).filter((u) => u.startsWith("https://") || u.startsWith("placeholder:")),
      active: Boolean(d.active),
      featured: Boolean(d.featured || d.badge),
      sort: Number.isFinite(d.sort) ? Math.trunc(d.sort) : 0,
    });

    let id = d.id;
    if (id) {
      const prev = must(await db.from("products").select("images").eq("id", id).single()) as { images: string[] };
      must(await db.from("products").update(record).eq("id", id));
      const removed = (prev.images ?? []).filter((u) => !record.images.includes(u));
      await removeFiles(db, removed);
    } else {
      const row = must(await db.from("products").insert(record).select("id").single()) as { id: string };
      id = row.id;
    }
    updateTag(CATALOG_TAG);
    return { id: id!, slug };
  });
}

export async function deleteProduct(id: string): Promise<Res> {
  return guarded(async (db) => {
    const prev = must(await db.from("products").select("images").eq("id", id).single()) as { images: string[] };
    must(await db.from("products").delete().eq("id", id));
    await removeFiles(db, prev.images ?? []);
    updateTag(CATALOG_TAG);
    return {};
  });
}

/* ------------------------------------------------------------------ Categorías */

export async function addCategory(label: string): Promise<Res<{ key: string }>> {
  return guarded(async (db) => {
    const l = clean(label, 80);
    if (!l) throw new Error("Escribe el nombre de la categoría.");
    const key = slugify(l) || `cat-${Date.now()}`;
    const { count } = await db.from("categories").select("key", { count: "exact", head: true });
    const { error } = await db.from("categories").insert({ key, label: l, sort_order: count ?? 0 });
    if (error) throw new Error(error.code === "23505" ? "Ya existe una categoría con ese nombre." : error.message);
    updateTag(CATALOG_TAG);
    return { key };
  });
}

export async function deleteCategory(key: string): Promise<Res> {
  return guarded(async (db) => {
    const { count } = await db.from("products").select("id", { count: "exact", head: true }).eq("category_key", key);
    if ((count ?? 0) > 0) throw new Error("Esta categoría tiene productos. Muévelos a otra categoría antes de eliminarla.");
    must(await db.from("categories").delete().eq("key", key));
    updateTag(CATALOG_TAG);
    return {};
  });
}

/* ------------------------------------------------------------------ Galería */

export async function addGalleryItem(input: { title: string; occ: string; pid: string | null; imageUrl: string; h: number }): Promise<Res> {
  return guarded(async (db) => {
    if (!input.imageUrl.startsWith("https://")) throw new Error("Imagen inválida.");
    const occ = Object.keys(OCCASIONS).includes(input.occ) ? input.occ : "infantil";
    must(
      await db.from("gallery_items").insert({
        title: clean(input.title, 120) || "Trabajo realizado",
        occasion: occ,
        product_id: input.pid || null,
        image_url: input.imageUrl,
        height: Math.min(300, Math.max(200, Math.round(input.h || 250))),
        sort_order: -Math.floor(Date.now() / 1000), // las nuevas primero
      }),
    );
    updateTag(CATALOG_TAG);
    return {};
  });
}

export async function updateGalleryItem(id: string, input: { title: string; occ: string; pid: string | null }): Promise<Res> {
  return guarded(async (db) => {
    must(
      await db
        .from("gallery_items")
        .update({
          title: clean(input.title, 120) || "Trabajo realizado",
          occasion: Object.keys(OCCASIONS).includes(input.occ) ? input.occ : "infantil",
          product_id: input.pid || null,
        })
        .eq("id", id),
    );
    updateTag(CATALOG_TAG);
    return {};
  });
}

export async function deleteGalleryItem(id: string): Promise<Res> {
  return guarded(async (db) => {
    const row = must(await db.from("gallery_items").select("image_url").eq("id", id).single()) as { image_url: string };
    must(await db.from("gallery_items").delete().eq("id", id));
    await removeFiles(db, [row.image_url]);
    updateTag(CATALOG_TAG);
    return {};
  });
}

/* ------------------------------------------------------------------ Reseñas */

export async function approveReview(id: string): Promise<Res> {
  return guarded(async (db) => {
    must(await db.from("reviews").update({ status: "published" }).eq("id", id));
    updateTag(CATALOG_TAG);
    return {};
  });
}

export async function deleteReview(id: string): Promise<Res> {
  return guarded(async (db) => {
    must(await db.from("reviews").delete().eq("id", id));
    updateTag(CATALOG_TAG);
    return {};
  });
}

/* ------------------------------------------------------------------ Cotizaciones */

export async function setLeadStatus(id: string, status: "nuevo" | "contactado" | "cerrado"): Promise<Res> {
  return guarded(async (db) => {
    if (!["nuevo", "contactado", "cerrado"].includes(status)) throw new Error("Estado inválido.");
    must(await db.from("leads").update({ status }).eq("id", id));
    return {};
  });
}

export async function deleteLead(id: string): Promise<Res> {
  return guarded(async (db) => {
    must(await db.from("leads").delete().eq("id", id));
    return {};
  });
}

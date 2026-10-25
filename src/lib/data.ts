import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { PRODUCT_COLS, toCategory, toGallery, toProduct, toReview } from "./db-map";
import { SEED_CATEGORIES, SEED_GALLERY, SEED_PRODUCTS, SEED_REVIEWS } from "./seed";
import { publicClient } from "./supabase/clients";
import { isSupabaseConfigured } from "./supabase/env";
import type { Product, PublicCatalog, Review } from "./types";

export const CATALOG_TAG = "catalog";

/**
 * Todo el contenido público en una sola lectura cacheada (el volumen es pequeño:
 * decenas de filas). Se invalida con updateTag("catalog") desde el panel y al publicar reseñas.
 */
export async function getPublicCatalog(): Promise<PublicCatalog> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  if (!isSupabaseConfigured) {
    return {
      categories: SEED_CATEGORIES,
      products: SEED_PRODUCTS,
      gallery: SEED_GALLERY,
      reviews: SEED_REVIEWS.filter((r) => r.status === "published"),
      demo: true,
    };
  }

  const db = publicClient();
  const [cats, prods, gal, revs] = await Promise.all([
    db.from("categories").select("key,label,sort_order").order("sort_order").order("label"),
    db.from("products").select(PRODUCT_COLS).eq("active", true).order("sort_order").order("created_at", { ascending: false }),
    db.from("gallery_items").select("id,title,occasion,product_id,image_url,height,sort_order").order("sort_order").order("created_at", { ascending: false }),
    db.from("reviews").select("id,product_id,name,stars,body,status,created_at").eq("status", "published").order("created_at", { ascending: false }),
  ]);
  const err = cats.error || prods.error || gal.error || revs.error;
  if (err) throw new Error(`Supabase: ${err.message}`);

  return {
    categories: (cats.data ?? []).map(toCategory),
    products: (prods.data ?? []).map(toProduct),
    gallery: (gal.data ?? []).map(toGallery),
    reviews: (revs.data ?? []).map(toReview),
    demo: false,
  };
}

export type RatingSummary = { avg: number; count: number };

export function ratingFor(reviews: Review[], productId: string | null | undefined): RatingSummary {
  if (!productId) return { avg: 0, count: 0 };
  const list = reviews.filter((r) => r.pid === productId);
  const avg = list.length ? list.reduce((a, b) => a + b.stars, 0) / list.length : 0;
  return { avg, count: list.length };
}

export function categoryLabel(catalog: PublicCatalog, key: string) {
  return catalog.categories.find((c) => c.key === key)?.label ?? key;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const catalog = await getPublicCatalog();
  return catalog.products.find((p) => p.slug === slug);
}

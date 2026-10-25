// Genera supabase/seed.sql y supabase/setup.sql (esquema + semilla) a partir de src/lib/seed.ts.
// Uso: npm run db:seed-sql
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_CATEGORIES, SEED_GALLERY, SEED_PRODUCTS, SEED_REVIEWS } from "../src/lib/seed.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const q = (s: string | null | undefined) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const arr = (a: string[]) => (a.length ? `array[${a.map(q).join(", ")}]::text[]` : "'{}'::text[]");

const lines: string[] = [
  "-- =====================================================================",
  "-- Petite Moments GT · Datos semilla (8 categorías, 12 productos, 12 fotos, reseñas de muestra)",
  "-- Generado por scripts/build-seed-sql.ts. Las imágenes son 'placeholder:N' (fondos decorativos):",
  "-- reemplázalas desde el panel subiendo fotos reales.",
  "-- =====================================================================",
  "",
  "begin;",
  "",
  "insert into public.categories (key, label, sort_order) values",
  SEED_CATEGORIES.map((c) => `  (${q(c.key)}, ${q(c.label)}, ${c.sort})`).join(",\n"),
  "on conflict (key) do update set label = excluded.label, sort_order = excluded.sort_order;",
  "",
  "insert into public.products (slug, name, category_key, occasions, styles, budget, price_label, badge, blurb, long_desc, recomendado, incluye, personalizable, opcionales, tiempo, images, active, featured, sort_order) values",
  SEED_PRODUCTS.map(
    (p) =>
      `  (${q(p.slug)}, ${q(p.name)}, ${q(p.cat)}, ${arr(p.occ)}, ${arr(p.style)}, ${q(p.budget)}, ${q(p.priceLabel)}, ${q(p.badge)},\n   ${q(p.blurb)},\n   ${q(p.longDesc)},\n   ${q(p.recomendado)}, ${arr(p.incluye)},\n   ${arr(p.personalizable)}, ${arr(p.opcionales)}, ${q(p.tiempo)}, ${arr(p.images)}, true, ${p.featured}, ${p.sort})`,
  ).join(",\n"),
  "on conflict (slug) do nothing;",
  "",
  "-- Galería (vinculada a productos por slug). Solo se inserta si la galería está vacía.",
  "insert into public.gallery_items (title, occasion, product_id, image_url, height, sort_order)",
  "select v.title, v.occasion, p.id, v.image_url, v.height, v.sort_order",
  "from (values",
  SEED_GALLERY.map((g) => `  (${q(g.title)}, ${q(g.occ)}, ${q(g.pid)}, ${q(g.img)}, ${g.h}, ${g.sort})`).join(",\n"),
  ") as v(title, occasion, slug, image_url, height, sort_order)",
  "left join public.products p on p.slug = v.slug",
  "where not exists (select 1 from public.gallery_items);",
  "",
  "-- Reseñas de MUESTRA del prototipo. Bórralas antes de publicar o carga las reales con autorización.",
  "-- El trigger asigna el estado según las estrellas (4★+ publicada, <4 pendiente).",
  "insert into public.reviews (product_id, name, stars, body, created_at)",
  "select p.id, v.name, v.stars, v.body, v.created_at::timestamptz",
  "from (values",
  SEED_REVIEWS.map((r) => `  (${q(r.pid)}, ${q(r.name)}, ${r.stars}, ${q(r.text)}, ${q(r.createdAt)})`).join(",\n"),
  ") as v(slug, name, stars, body, created_at)",
  "join public.products p on p.slug = v.slug",
  "where not exists (select 1 from public.reviews);",
  "",
  "commit;",
  "",
];

const seed = lines.join("\n");
writeFileSync(join(root, "supabase/seed.sql"), seed);
const schema = readFileSync(join(root, "supabase/schema.sql"), "utf8");
writeFileSync(
  join(root, "supabase/setup.sql"),
  `-- Archivo único para pegar en Supabase → SQL Editor: esquema + datos semilla.\n-- (Generado: equivale a schema.sql seguido de seed.sql)\n\n${schema}\n\n${seed}`,
);
console.log("✓ supabase/seed.sql y supabase/setup.sql generados");

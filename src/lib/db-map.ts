// Conversión entre filas de Postgres (snake_case) y los tipos de la app.
import type { BudgetKey } from "./config";
import type { Category, GalleryItem, Lead, Product, Review } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

export const PRODUCT_COLS =
  "id,slug,name,category_key,occasions,styles,budget,price_label,badge,blurb,long_desc,recomendado,incluye,personalizable,opcionales,tiempo,images,active,featured,sort_order";

export const toCategory = (r: Row): Category => ({ key: r.key, label: r.label, sort: r.sort_order ?? 0 });

export const toProduct = (r: Row): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  cat: r.category_key,
  occ: r.occasions ?? [],
  style: r.styles ?? [],
  budget: (r.budget ?? "cotizar") as BudgetKey,
  priceLabel: r.price_label ?? "A cotizar",
  badge: r.badge || null,
  blurb: r.blurb ?? "",
  longDesc: r.long_desc ?? "",
  recomendado: r.recomendado ?? "",
  incluye: r.incluye ?? [],
  personalizable: r.personalizable ?? [],
  opcionales: r.opcionales ?? [],
  tiempo: r.tiempo ?? "",
  images: r.images ?? [],
  active: r.active ?? true,
  featured: r.featured ?? false,
  sort: r.sort_order ?? 0,
});

export const fromProduct = (p: Omit<Product, "id">) => ({
  slug: p.slug,
  name: p.name,
  category_key: p.cat,
  occasions: p.occ,
  styles: p.style,
  budget: p.budget,
  price_label: p.priceLabel,
  badge: p.badge,
  blurb: p.blurb,
  long_desc: p.longDesc,
  recomendado: p.recomendado,
  incluye: p.incluye,
  personalizable: p.personalizable,
  opcionales: p.opcionales,
  tiempo: p.tiempo,
  images: p.images,
  active: p.active,
  featured: p.featured,
  sort_order: p.sort,
});

export const toGallery = (r: Row): GalleryItem => ({
  id: r.id,
  title: r.title,
  occ: r.occasion,
  pid: r.product_id ?? null,
  img: r.image_url,
  h: r.height ?? 250,
  sort: r.sort_order ?? 0,
});

export const toReview = (r: Row): Review => ({
  id: r.id,
  pid: r.product_id,
  name: r.name,
  stars: r.stars,
  text: r.body,
  status: r.status,
  createdAt: r.created_at,
});

export const toLead = (r: Row): Lead => ({
  id: r.id,
  nombre: r.nombre,
  whatsapp: r.whatsapp,
  correo: r.correo,
  fecha: r.fecha,
  hora: r.hora,
  tipo: r.tipo,
  invitados: r.invitados,
  zona: r.zona,
  lugar: r.lugar,
  servicio: r.servicio,
  estilo: r.estilo,
  presupuesto: r.presupuesto,
  comentarios: r.comentarios,
  contacto: r.contacto,
  productSlug: r.product_slug,
  status: r.status,
  createdAt: r.created_at,
});

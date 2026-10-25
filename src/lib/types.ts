import type { BudgetKey } from "./config";

export type Category = {
  key: string;
  label: string;
  sort: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  cat: string;
  occ: string[];
  style: string[];
  budget: BudgetKey;
  priceLabel: string;
  badge: string | null;
  blurb: string;
  longDesc: string;
  recomendado: string;
  incluye: string[];
  personalizable: string[];
  opcionales: string[];
  tiempo: string;
  /** URLs públicas de Storage o `placeholder:N` (fondo decorativo). */
  images: string[];
  active: boolean;
  featured: boolean;
  sort: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  occ: string;
  pid: string | null;
  img: string;
  h: number;
  sort: number;
};

export type ReviewStatus = "published" | "pending";

export type Review = {
  id: string;
  pid: string;
  name: string;
  stars: number;
  text: string;
  status: ReviewStatus;
  createdAt: string;
};

export type Lead = {
  id: string;
  nombre: string;
  whatsapp: string;
  correo: string | null;
  fecha: string | null;
  hora: string | null;
  tipo: string;
  invitados: string | null;
  zona: string | null;
  lugar: string | null;
  servicio: string | null;
  estilo: string | null;
  presupuesto: string | null;
  comentarios: string | null;
  contacto: string | null;
  productSlug: string | null;
  status: "nuevo" | "contactado" | "cerrado";
  createdAt: string;
};

export type PublicCatalog = {
  categories: Category[];
  products: Product[];
  gallery: GalleryItem[];
  /** Solo reseñas publicadas. */
  reviews: Review[];
  demo: boolean;
};

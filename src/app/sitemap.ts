import type { MetadataRoute } from "next";
import { getPublicCatalog } from "@/lib/data";
import { absUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories } = await getPublicCatalog();
  return [
    { url: absUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absUrl("/catalogo"), changeFrequency: "weekly", priority: 0.9 },
    { url: absUrl("/galeria"), changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/cotizar"), changeFrequency: "monthly", priority: 0.8 },
    ...categories.map((c) => ({ url: absUrl(`/catalogo?categoria=${c.key}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: absUrl(`/producto/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}

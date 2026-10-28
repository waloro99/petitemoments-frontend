import type { MetadataRoute } from "next";
import { isPlaceholder } from "@/components/Media";
import { getPublicCatalog } from "@/lib/data";
import { LANDINGS, landingHref } from "@/lib/landing";
import { absUrl } from "@/lib/seo";

// Solo URLs canónicas (sin parámetros ?categoria=): Google indexa las páginas de servicio y evento.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getPublicCatalog();
  return [
    { url: absUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...LANDINGS.map((l) => ({ url: absUrl(landingHref(l)), changeFrequency: "weekly" as const, priority: l.kind === "servicios" ? 0.9 : 0.85 })),
    { url: absUrl("/catalogo"), changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/galeria"), changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/cotizar"), changeFrequency: "monthly", priority: 0.7 },
    ...products.map((p) => {
      const imgs = p.images.filter((i) => !isPlaceholder(i));
      return {
        url: absUrl(`/producto/${p.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(imgs.length ? { images: imgs.slice(0, 5) } : {}),
      };
    }),
    { url: absUrl("/privacidad"), changeFrequency: "yearly", priority: 0.2 },
  ];
}

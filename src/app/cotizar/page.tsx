import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { Breadcrumb } from "@/components/ui";
import { getPublicCatalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cotizar decoración o sorpresa para tu evento",
  description:
    "Solicita tu cotización de decoración con globos, sorpresas, repostería, fotografía o inflables en Guatemala. Respondemos por WhatsApp en menos de 24 h.",
  alternates: { canonical: "/cotizar" },
};

export default function QuotePage({ searchParams }: PageProps<"/cotizar">) {
  // El formulario se pinta de inmediato; solo el nombre del producto (?producto=slug) llega después.
  const productPromise = searchParams.then(async (sp) => {
    const slug = Array.isArray(sp.producto) ? sp.producto[0] : sp.producto;
    if (!slug) return null;
    const { products } = await getPublicCatalog();
    return products.find((p) => p.slug === slug)?.name ?? null;
  });
  return (
    <main className="pm-container max-w-[1080px] py-10">
      <Breadcrumb className="mb-4" items={[{ label: "Inicio", href: "/" }, { label: "Cotizar" }]} />
      <QuoteForm productPromise={productPromise} />
    </main>
  );
}

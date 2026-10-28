import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GridIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb, chipClass, PageIntro } from "@/components/ui";
import { BUDGETS, OCCASIONS, STYLES } from "@/lib/config";
import { categoryLabel, getPublicCatalog } from "@/lib/data";
import { WA_MSG, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Catálogo de decoración, cake toppers y sorpresas",
  description:
    "Catálogo de Petite Moments GT: arcos de globos, bouquets, cajas sorpresa, cake toppers, centros de mesa, juegos y paquetes para eventos en Guatemala. Filtra por ocasión, estilo y presupuesto.",
  alternates: { canonical: "/catalogo" },
};

type Filters = { categoria?: string; ocasion?: string; estilo?: string; presupuesto?: string };
type FilterKey = keyof Filters;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function hrefWith(current: Filters, key: FilterKey, value?: string) {
  const next: Filters = { ...current, [key]: value };
  const qs = new URLSearchParams();
  (Object.keys(next) as FilterKey[]).forEach((k) => {
    if (next[k]) qs.set(k, next[k]!);
  });
  const s = qs.toString();
  return s ? `/catalogo?${s}` : "/catalogo";
}

export default function CatalogPage({ searchParams }: PageProps<"/catalogo">) {
  return (
    <main className="pm-container max-w-[1240px] py-10">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Catálogo" }]} />
      <PageIntro icon={<GridIcon />} iconClass="bg-rose-soft text-blush" title="Catálogo de productos y servicios">
        Todo lo que puedes <strong className="text-ink-2">cotizar</strong>: productos individuales, servicios y paquetes. Filtra
        por ocasión, estilo o presupuesto. ¿Buscas inspiración de eventos reales?{" "}
        <Link href="/galeria" className="font-bold text-blush underline underline-offset-[3px]">
          Visita la galería →
        </Link>
      </PageIntro>
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function CatalogResults({ searchParams }: { searchParams: PageProps<"/catalogo">["searchParams"] }) {
  const sp = await searchParams;
  const catalog = await getPublicCatalog();

  const valid = {
    categoria: catalog.categories.map((c) => c.key),
    ocasion: Object.keys(OCCASIONS),
    estilo: Object.keys(STYLES),
    presupuesto: Object.keys(BUDGETS),
  };
  const f: Filters = {};
  (Object.keys(valid) as FilterKey[]).forEach((k) => {
    const v = one(sp[k]);
    if (v && valid[k].includes(v)) f[k] = v;
  });

  const products = catalog.products.filter(
    (p) =>
      (!f.categoria || p.cat === f.categoria) &&
      (!f.ocasion || p.occ.includes(f.ocasion)) &&
      (!f.estilo || p.style.includes(f.estilo)) &&
      (!f.presupuesto || p.budget === f.presupuesto),
  );

  const groups: { key: FilterKey; title: string; all: string; options: [string, string][] }[] = [
    { key: "categoria", title: "Categoría", all: "Todos", options: catalog.categories.map((c) => [c.key, c.label]) },
    { key: "ocasion", title: "Ocasión", all: "Todas", options: Object.entries(OCCASIONS) },
    { key: "estilo", title: "Estilo", all: "Todos", options: Object.entries(STYLES) },
    { key: "presupuesto", title: "Presupuesto", all: "Todos", options: Object.entries(BUDGETS) },
  ];

  return (
    <div className="grid grid-cols-[246px_1fr] items-start gap-[30px] tab:grid-cols-1">
      <aside
        aria-label="Filtros"
        className="sticky top-24 rounded-[20px] border border-line bg-white p-[22px] shadow-[0_6px_22px_-16px_rgba(109,74,82,.25)] tab:static"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-[.14em] text-champagne">Filtrar</span>
          <Link href="/catalogo" scroll={false} className="text-[12.5px] font-bold text-blush hover:underline">
            Limpiar
          </Link>
        </div>
        {groups.map((g) => (
          <div key={g.key} className="mb-[18px] last:mb-0" role="group" aria-label={g.title}>
            <div className="mb-2.5 text-[12.5px] font-extrabold text-ink-2">{g.title}</div>
            <div className="flex flex-wrap gap-[7px]">
              <Link href={hrefWith(f, g.key)} scroll={false} aria-current={!f[g.key] ? "true" : undefined} className={chipClass(!f[g.key])}>
                {g.all}
              </Link>
              {g.options.map(([k, label]) => (
                <Link
                  key={k}
                  href={hrefWith(f, g.key, k)}
                  scroll={false}
                  aria-current={f[g.key] === k ? "true" : undefined}
                  className={chipClass(f[g.key] === k)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <section aria-label="Resultados">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13.5px] font-semibold text-ink-4" aria-live="polite">
            {products.length} {products.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-3 gap-[18px] tab:grid-cols-2 mob:grid-cols-1">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} catLabel={categoryLabel(catalog, p.cat)} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-[60px] text-center text-ink-4">
            {catalog.products.length === 0 ? (
              <>
                <p className="mb-3.5 text-base">Estamos preparando nuestro catálogo. Mientras tanto, cuéntanos qué necesitas.</p>
                <a
                  href={waLink(WA_MSG.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-wa px-[22px] py-3 font-bold text-white hover:bg-wa-dark"
                >
                  Cotizar por WhatsApp
                </a>
              </>
            ) : (
              <>
                <p className="mb-3.5 text-base">No encontramos productos con esos filtros.</p>
                <Link href="/catalogo" className="inline-block rounded-full bg-blush px-[22px] py-3 font-bold text-white hover:bg-blush-dark">
                  Limpiar filtros
                </Link>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-[246px_1fr] items-start gap-[30px] tab:grid-cols-1" aria-busy="true">
      <div className="h-[520px] rounded-[20px] border border-line bg-white tab:h-40" />
      <div className="grid grid-cols-3 gap-[18px] pt-9 tab:grid-cols-2 mob:grid-cols-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/6] animate-pulse rounded-[20px] border border-line bg-white" />
        ))}
      </div>
    </div>
  );
}

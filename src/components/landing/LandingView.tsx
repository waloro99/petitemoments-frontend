import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid, type GalleryCard } from "@/components/gallery/GalleryGrid";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { isPlaceholder } from "@/components/Media";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/ui";
import { occLabel, SITE } from "@/lib/config";
import { categoryLabel, getPublicCatalog, ratingFor } from "@/lib/data";
import { findLanding, type Landing, landingHref, type LandingKind, LANDINGS, landingsOf } from "@/lib/landing";
import { absUrl, breadcrumbLd } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export function landingStaticParams(kind: LandingKind) {
  return landingsOf(kind).map((l) => ({ slug: l.slug }));
}

export function landingMetadata(kind: LandingKind, slug: string): Metadata {
  const l = findLanding(kind, slug);
  if (!l) return { title: "Página no encontrada", robots: { index: false } };
  const path = landingHref(l);
  return {
    title: { absolute: `${l.title} · ${SITE.shortName}` },
    description: l.description,
    alternates: { canonical: path },
    openGraph: { title: l.title, description: l.description, url: path, type: "website", locale: "es_GT", siteName: SITE.name },
  };
}

const KIND_LABEL: Record<LandingKind, string> = { servicios: "Servicio", eventos: "Eventos" };

export async function LandingView({ kind, slug }: { kind: LandingKind; slug: string }) {
  const l = findLanding(kind, slug);
  if (!l) notFound();

  const catalog = await getPublicCatalog();
  const matches = (p: { cat: string; occ: string[] }) =>
    (l.categories?.includes(p.cat) ?? false) || (l.occasions?.some((o) => p.occ.includes(o)) ?? false);
  const products = catalog.products.filter(matches);
  const productIds = new Set(products.map((p) => p.id));

  const gallery: GalleryCard[] = catalog.gallery
    .filter((g) => (g.pid && productIds.has(g.pid)) || (l.occasions?.includes(g.occ) ?? false))
    .filter((g) => !isPlaceholder(g.img))
    .slice(0, 9)
    .map((g) => {
      const { avg, count } = ratingFor(catalog.reviews, g.pid);
      return {
        id: g.id,
        title: g.title,
        occLabel: occLabel(g.occ),
        img: g.img,
        h: g.h,
        badge: count ? `${Math.round(avg * 10) / 10} · ${count}` : null,
        reviews: catalog.reviews.filter((r) => r.pid === g.pid).map((r) => ({ id: r.id, name: r.name, stars: r.stars, text: r.text })),
      };
    });

  const path = landingHref(l);
  const related = LANDINGS.filter((x) => x !== l && x.kind === l.kind).slice(0, 8);
  const other = LANDINGS.filter((x) => x.kind !== l.kind).slice(0, 6);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: l.h1,
      serviceType: l.label,
      description: l.description,
      url: absUrl(path),
      provider: { "@id": `${SITE.url}/#negocio` },
      areaServed: { "@type": "City", name: SITE.city },
      ...(products.length
        ? {
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: l.label,
              itemListElement: products.slice(0, 20).map((p) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Product", name: p.name, url: absUrl(`/producto/${p.slug}`) },
              })),
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: l.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    breadcrumbLd([
      { name: "Inicio", path: "/" },
      { name: "Catálogo", path: "/catalogo" },
      { name: l.label, path },
    ]),
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Catálogo", href: "/catalogo" }, { label: l.label }]} />

      <header className="mb-10 mt-4 grid grid-cols-[1.2fr_1fr] items-start gap-10 tab:grid-cols-1 tab:gap-6">
        <div>
          <div className="pm-eyebrow mb-3">
            {KIND_LABEL[l.kind]} · {SITE.city}
          </div>
          <h1 className="mb-5 font-title text-[46px] font-semibold leading-[1.08] text-ink tab:text-[40px] mob:text-[32px]">{l.h1}</h1>
          {l.intro.map((t, i) => (
            <p key={i} className="mb-3.5 max-w-[640px] text-[16px] leading-[1.65] text-ink-3">
              {t}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={waLink(l.wa)}
              data-track={`landing:${l.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-wa px-7 py-4 text-[15px] font-bold text-white shadow-[0_12px_26px_-10px_rgba(37,211,102,.6)] transition-colors hover:bg-wa-dark"
            >
              <WhatsAppIcon size={20} />
              Cotizar por WhatsApp
            </a>
            <Link
              href="/cotizar"
              className="inline-flex items-center rounded-full border border-line-input bg-white px-7 py-4 text-[15px] font-bold text-mocha transition-colors hover:bg-warm"
            >
              Llenar formulario
            </Link>
          </div>
        </div>
        <aside className="rounded-3xl border border-line bg-white p-7 shadow-[0_14px_34px_-24px_rgba(109,74,82,.3)]">
          <h2 className="mb-4 font-display text-[24px] font-semibold text-ink">Lo que podemos preparar</h2>
          <ul className="flex flex-col gap-3">
            {l.incluye.map((x) => (
              <li key={x} className="flex items-start gap-2.5 text-[15px] text-ink-2">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-ok-bg text-wa">
                  <CheckIcon size={13} />
                </span>
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-[13.5px] text-ink-4">
            Cobertura: {SITE.coverage} · {SITE.hours}
          </p>
        </aside>
      </header>

      <section aria-labelledby="h-productos" className="mb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 id="h-productos" className="pm-h2">
            Opciones para cotizar
          </h2>
          {products.length > 0 && (
            <Link href={l.catalogHref} className="text-[14.5px] font-bold text-blush hover:underline">
              Ver en el catálogo →
            </Link>
          )}
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-3 gap-[18px] tab:grid-cols-2 mob:grid-cols-1">
            {products.slice(0, 9).map((p, i) => (
              <ProductCard key={p.id} p={p} catLabel={categoryLabel(catalog, p.cat)} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-line-dash bg-white/60 px-6 py-12 text-center text-ink-4">
            Muy pronto publicaremos aquí nuestras opciones. Mientras tanto, cuéntanos tu idea por WhatsApp y te enviamos propuestas.
          </div>
        )}
      </section>

      {gallery.length > 0 && (
        <section aria-labelledby="h-galeria" className="mb-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="h-galeria" className="pm-h2">
              Trabajos realizados
            </h2>
            <Link href="/galeria" className="text-[14.5px] font-bold text-blush hover:underline">
              Ver galería completa →
            </Link>
          </div>
          <GalleryGrid items={gallery} />
        </section>
      )}

      <section aria-labelledby="h-faq" className="mb-14 max-w-[820px]">
        <h2 id="h-faq" className="pm-h2 mb-6">
          Preguntas frecuentes
        </h2>
        <div className="flex flex-col gap-3">
          {l.faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-white px-5 py-4 open:shadow-[0_10px_26px_-20px_rgba(109,74,82,.35)]">
              <summary className="cursor-pointer list-none text-[15.5px] font-bold text-ink-2 marker:hidden">
                <span className="mr-2 inline-block text-blush transition-transform group-open:rotate-45">+</span>
                {f.q}
              </summary>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav aria-labelledby="h-relacionados" className="rounded-3xl bg-warm2 p-7">
        <h2 id="h-relacionados" className="mb-4 font-display text-[22px] font-semibold text-ink">
          {l.kind === "servicios" ? "Otros servicios" : "Otras celebraciones"}
        </h2>
        <ul className="mb-5 flex flex-wrap gap-2.5">
          {related.map((x) => (
            <li key={x.slug}>
              <Link href={landingHref(x)} className="inline-flex rounded-full border border-line-warm bg-white px-4 py-2 text-[13.5px] font-semibold text-ink-3 hover:border-blush hover:text-blush-dark">
                {x.label}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-[.12em] text-ink-4">
          {l.kind === "servicios" ? "Por tipo de evento" : "Por servicio"}
        </h3>
        <ul className="flex flex-wrap gap-2.5">
          {other.map((x) => (
            <li key={x.slug}>
              <Link href={landingHref(x)} className="inline-flex rounded-full border border-line-warm bg-white px-4 py-2 text-[13.5px] font-semibold text-ink-3 hover:border-blush hover:text-blush-dark">
                {x.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <JsonLd data={ld} />
    </>
  );
}

export function LandingSkeleton() {
  return <div className="h-[60vh] animate-pulse rounded-3xl bg-warm2/60" aria-hidden />;
}

export type { Landing };

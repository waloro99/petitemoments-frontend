import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CheckIcon, ClockIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { isPlaceholder } from "@/components/Media";
import { Carousel } from "@/components/product/Carousel";
import { ReviewForm } from "@/components/product/ReviewForm";
import { Breadcrumb, starsText } from "@/components/ui";
import { SITE } from "@/lib/config";
import { categoryLabel, getPublicCatalog, ratingFor } from "@/lib/data";
import { absUrl, breadcrumbLd } from "@/lib/seo";
import { productMailto, WA_MSG, waLink } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const { products } = await getPublicCatalog();
  // Con Cache Components debe devolverse al menos un parámetro.
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__vacio__" }];
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const p = catalog.products.find((x) => x.slug === slug);
  if (!p) return { title: "Producto no encontrado", robots: { index: false } };
  const cat = categoryLabel(catalog, p.cat);
  const img = p.images.find((i) => !isPlaceholder(i));
  return {
    title: `${p.name} en Guatemala`,
    description: `${p.blurb} ${p.priceLabel}. ${cat} en Ciudad de Guatemala — cotiza por WhatsApp con Petite Moments GT.`.slice(0, 160),
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { title: `${p.name} · Petite Moments GT`, description: p.blurb, url: `/producto/${p.slug}`, images: img ? [{ url: img }] : undefined },
  };
}

export default function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  return (
    <main className="pm-container max-w-[1180px] pb-10 pt-[34px]">
      <Suspense fallback={<DetailSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/producto/[slug]">["params"] }) {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const p = catalog.products.find((x) => x.slug === slug);
  if (!p) notFound();

  const cat = categoryLabel(catalog, p.cat);
  const reviews = catalog.reviews.filter((r) => r.pid === p.id);
  const { avg, count } = ratingFor(catalog.reviews, p.id);
  const avgRounded = Math.round(avg * 10) / 10;
  const realImages = p.images.filter((i) => !isPlaceholder(i));

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.longDesc || p.blurb,
    category: cat,
    url: absUrl(`/producto/${p.slug}`),
    brand: { "@type": "Brand", name: SITE.name },
    ...(realImages.length ? { image: realImages } : {}),
    ...(() => {
      const m = p.priceLabel.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
      return m
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "GTQ",
              price: m[1],
              availability: "https://schema.org/InStock",
              url: absUrl(`/producto/${p.slug}`),
              seller: { "@id": `${SITE.url}/#negocio` },
            },
          }
        : {};
    })(),
    ...(count
      ? {
          aggregateRating: { "@type": "AggregateRating", ratingValue: avgRounded, reviewCount: count, bestRating: 5, worstRating: 1 },
          review: reviews.slice(0, 10).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
            reviewBody: r.text,
            datePublished: r.createdAt?.slice(0, 10),
          })),
        }
      : {}),
  };

  return (
    <>
      <Breadcrumb className="mb-5" items={[{ label: "Inicio", href: "/" }, { label: "Catálogo", href: "/catalogo" }, { label: p.name }]} />
      <div className="grid grid-cols-2 items-start gap-11 tab:grid-cols-1">
        <Carousel key={p.id} images={p.images} alt={p.name} catLabel={cat} />

        <div>
          <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[.14em] text-champagne">{cat}</div>
          <h1 className="mb-2 font-title text-[44px] font-semibold leading-[1.05] text-ink mob:text-[36px]">{p.name}</h1>
          <div className="mb-[18px] text-xl font-extrabold text-blush-dark">{p.priceLabel}</div>
          <p className="mb-6 text-[15.5px] leading-[1.65] text-ink-3">{p.longDesc || p.blurb}</p>

          {p.recomendado && (
            <div className="mb-5 rounded-2xl border border-line-warm bg-warm px-[18px] py-4">
              <div className="mb-1.5 text-xs font-extrabold uppercase tracking-[.06em] text-champagne">Recomendado para</div>
              <div className="text-[14.5px] font-semibold text-ink-2">{p.recomendado}</div>
            </div>
          )}

          {p.incluye.length > 0 && (
            <div className="mb-[22px]">
              <h2 className="mb-3 text-[15px] font-extrabold text-ink">Qué incluye</h2>
              <ul className="flex flex-col gap-[9px]">
                {p.incluye.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-[1.45] text-ink-2">
                    <CheckIcon className="mt-px flex-none text-blush" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.personalizable.length > 0 && (
            <div className="mb-[22px]">
              <h2 className="mb-3 text-[15px] font-extrabold text-ink">Qué puedes personalizar</h2>
              <ul className="flex flex-wrap gap-2">
                {p.personalizable.map((x) => (
                  <li key={x} className="rounded-full bg-warm2 px-3.5 py-[7px] text-[12.5px] font-semibold text-[#8A5A5F]">{x}</li>
                ))}
              </ul>
            </div>
          )}

          {p.opcionales.length > 0 && (
            <div className="mb-[26px]">
              <h2 className="mb-3 text-[15px] font-extrabold text-ink">Opciones adicionales</h2>
              <ul className="flex flex-wrap gap-2">
                {p.opcionales.map((x) => (
                  <li key={x} className="rounded-full border border-dashed border-line-dash px-3.5 py-[7px] text-[12.5px] font-semibold text-[#9A8272]">+ {x}</li>
                ))}
              </ul>
            </div>
          )}

          {p.tiempo && (
            <div className="mb-[22px] flex items-center gap-2.5 rounded-xl border border-line bg-white px-[15px] py-3 text-[13.5px] text-ink-4">
              <ClockIcon className="flex-none text-champagne" />
              <span>
                <strong className="text-ink-2">Reserva recomendada:</strong> {p.tiempo}
              </span>
            </div>
          )}

          <div className="sticky bottom-0 -mx-2 flex flex-col gap-2.5 rounded-t-[18px] bg-[rgba(250,245,239,.94)] px-2 pb-4 pt-2.5 backdrop-blur-[6px]">
            <a
              href={waLink(WA_MSG.product(p.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-[15px] bg-wa p-[17px] text-base font-extrabold text-white shadow-[0_12px_26px_-10px_rgba(37,211,102,.6)] transition-colors hover:bg-wa-dark"
            >
              <WhatsAppIcon size={21} />
              Cotizar por WhatsApp
            </a>
            <div className="flex gap-2.5">
              <a href={productMailto(p.name)} className="flex-1 rounded-[13px] border border-line-input bg-white p-3.5 text-center text-sm font-bold text-mocha transition-colors hover:bg-warm">
                Cotizar por correo
              </a>
              <Link
                href={`/cotizar?producto=${p.slug}`}
                className="flex-1 rounded-[13px] border border-line-warm bg-warm p-3.5 text-center text-sm font-bold text-mocha transition-colors hover:bg-warm-hover"
              >
                Usar formulario
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RESEÑAS */}
      <section className="mt-14 border-t border-line pt-9" aria-labelledby="h-reviews">
        <div className="mb-5">
          <h2 id="h-reviews" className="mb-1.5 font-title text-[32px] font-semibold text-ink">Reseñas de clientes</h2>
          <div className="flex items-center gap-[9px] text-sm font-semibold text-ink-4">
            <span className="text-[17px] tracking-[2px] text-star" aria-hidden>
              {count ? starsText(Math.round(avg)) : "☆☆☆☆☆"}
            </span>
            <span>{count ? `${avgRounded} de 5 · ${count} reseña${count === 1 ? "" : "s"}` : "Aún sin reseñas"}</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_360px] items-start gap-[26px] tab:grid-cols-1">
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-2xl border border-line bg-white px-5 py-[18px]">
                <div className="mb-[7px] flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#F3DBD9] text-[13px] font-extrabold text-blush-dark" aria-hidden>
                      {(r.name || "?").trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-extrabold text-ink">{r.name}</span>
                  </div>
                  <span className="text-[15px] tracking-[2px] text-star" aria-label={`${r.stars} de 5 estrellas`}>
                    {starsText(r.stars)}
                  </span>
                </div>
                <p className="m-0 text-sm leading-[1.6] text-ink-3">{r.text}</p>
              </article>
            ))}
            {count === 0 && (
              <div className="rounded-2xl border border-dashed border-[#E0CBBB] bg-warm p-[26px] text-center text-sm text-[#9A8272]">
                Este producto aún no tiene reseñas. ¡Sé la primera persona en contar tu experiencia!
              </div>
            )}
          </div>
          <ReviewForm productId={p.id} />
        </div>
      </section>

      <JsonLd data={productLd} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Catálogo", path: "/catalogo" },
          { name: p.name, path: `/producto/${p.slug}` },
        ])}
      />
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-11 pt-9 tab:grid-cols-1" aria-busy="true">
      <div className="aspect-[4/5] animate-pulse rounded-3xl bg-[#EFE2D8]" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 rounded bg-warm2" />
        <div className="h-12 w-3/4 rounded bg-warm2" />
        <div className="h-32 rounded bg-warm" />
      </div>
    </div>
  );
}

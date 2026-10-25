import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GalleryGrid, type GalleryCard } from "@/components/gallery/GalleryGrid";
import { PhotoIcon } from "@/components/icons";
import { Breadcrumb, chipClass, PageIntro } from "@/components/ui";
import { occLabel } from "@/lib/config";
import { getPublicCatalog, ratingFor } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galería de trabajos reales: decoración de eventos en Guatemala",
  description:
    "Inspírate con cumpleaños, baby showers, aniversarios y eventos corporativos que Petite Moments GT ha decorado en Ciudad de Guatemala.",
  alternates: { canonical: "/galeria" },
};

export default function GalleryPage({ searchParams }: PageProps<"/galeria">) {
  return (
    <main className="pm-container max-w-[1240px] py-10">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Galería" }]} />
      <PageIntro icon={<PhotoIcon />} iconClass="bg-sand-soft text-champagne" title="Galería de trabajos reales" className="mb-6">
        Inspírate con celebraciones que ya montamos. Toca cualquier foto para verla en grande. ¿Quieres cotizar algo puntual?{" "}
        <Link href="/catalogo" className="font-bold text-blush underline underline-offset-[3px]">
          Ve al catálogo →
        </Link>
      </PageIntro>
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-warm" aria-busy="true" />}>
        <GalleryResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function GalleryResults({ searchParams }: { searchParams: PageProps<"/galeria">["searchParams"] }) {
  const sp = await searchParams;
  const catalog = await getPublicCatalog();
  const occKeys = Array.from(new Set(catalog.gallery.map((g) => g.occ)));
  const raw = Array.isArray(sp.ocasion) ? sp.ocasion[0] : sp.ocasion;
  const active = raw && occKeys.includes(raw) ? raw : null;

  const items: GalleryCard[] = catalog.gallery
    .filter((g) => !active || g.occ === active)
    .map((g) => {
      const { avg, count } = ratingFor(catalog.reviews, g.pid);
      return {
        id: g.id,
        title: g.title,
        occLabel: occLabel(g.occ),
        img: g.img,
        h: g.h,
        badge: count ? `${Math.round(avg * 10) / 10} · ${count}` : null,
        reviews: catalog.reviews
          .filter((r) => r.pid === g.pid)
          .map((r) => ({ id: r.id, name: r.name, stars: r.stars, text: r.text })),
      };
    });

  return (
    <>
      <nav aria-label="Filtrar por ocasión" className="-mx-1 mb-6 flex gap-[9px] overflow-x-auto px-1 pb-1 mob:flex-nowrap flex-wrap">
        <Link href="/galeria" scroll={false} aria-current={!active ? "true" : undefined} className={`flex-none ${chipClass(!active, "md")}`}>
          Todas
        </Link>
        {occKeys.map((k) => (
          <Link
            key={k}
            href={`/galeria?ocasion=${k}`}
            scroll={false}
            aria-current={active === k ? "true" : undefined}
            className={`flex-none ${chipClass(active === k, "md")}`}
          >
            {occLabel(k)}
          </Link>
        ))}
      </nav>
      {items.length ? (
        <GalleryGrid key={active ?? "todas"} items={items} />
      ) : (
        <p className="py-16 text-center text-ink-4">Aún no hay fotos en esta ocasión.</p>
      )}
    </>
  );
}

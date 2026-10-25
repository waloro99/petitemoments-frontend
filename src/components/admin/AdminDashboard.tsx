"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/admin/actions";
import type { Category, GalleryItem, Lead, Product, Review } from "@/lib/types";
import { CategoriesTab } from "./CategoriesTab";
import { GalleryTab } from "./GalleryTab";
import { LeadsTab } from "./LeadsTab";
import { ProductsTab } from "./ProductsTab";
import { ReviewsTab } from "./ReviewsTab";
import type { Run } from "./shared";

export type AdminData = {
  products: Product[];
  categories: Category[];
  gallery: GalleryItem[];
  reviews: Review[];
  leads: Lead[];
};

type Tab = "productos" | "categorias" | "galeria" | "resenas" | "cotizaciones";

export function AdminDashboard({ data, email, readOnly }: { data: AdminData; email: string; readOnly?: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("productos");
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.ok ? 2800 : 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const run: Run = async (fn, okText) => {
    const res = await fn();
    if (!res.ok) {
      setToast({ ok: false, text: res.error });
      return false;
    }
    if (okText) setToast({ ok: true, text: okText });
    router.refresh();
    return true;
  };

  const pending = data.reviews.filter((r) => r.status === "pending").length;
  const newLeads = data.leads.filter((l) => l.status === "nuevo").length;
  const tabs: { key: Tab; label: string }[] = [
    { key: "productos", label: "Productos" },
    { key: "categorias", label: "Categorías" },
    { key: "galeria", label: "Galería" },
    { key: "resenas", label: `Reseñas${pending ? ` (${pending})` : ""}` },
    { key: "cotizaciones", label: `Cotizaciones${newLeads ? ` (${newLeads})` : ""}` },
  ];

  return (
    <div>
      {readOnly && (
        <div className="mb-5 rounded-xl border border-wait-line bg-wait-bg px-4 py-3 text-[13px] font-semibold text-wait-text">
          Modo demo: estás viendo los datos semilla en solo lectura. Conecta Supabase (ver README) para iniciar sesión y guardar cambios.
        </div>
      )}
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <div className="pm-eyebrow mb-1.5">Petite Moments · Administración</div>
          <h1 className="font-display text-4xl font-semibold text-ink">Gestión del catálogo</h1>
          <div className="mt-1 text-xs text-ink-5">Sesión: {email}</div>
        </div>
        <div className="flex gap-2.5">
          <Link href="/" className="rounded-[11px] border border-line-input bg-white px-[18px] py-[11px] text-[13.5px] font-bold text-mocha hover:bg-warm">
            Ver sitio
          </Link>
          {!readOnly && (
            <form action={signOut}>
              <button className="rounded-[11px] border border-danger-line bg-danger-bg px-[18px] py-[11px] text-[13.5px] font-bold text-danger-text hover:bg-danger-hover">
                Cerrar sesión
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="my-[22px] mb-[26px] grid grid-cols-3 gap-3.5 mob:grid-cols-1">
        <Stat n={data.products.filter((p) => p.active).length} label="Productos activos" color="#C0808C" />
        <Stat n={data.categories.length} label="Categorías" color="#B08968" />
        <Stat n={data.gallery.length} label="Fotos en galería" color="#B58A6E" />
      </div>

      <div role="tablist" aria-label="Secciones del panel" className="mb-6 inline-flex flex-wrap rounded-xl bg-warm2 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-[9px] px-5 py-2.5 text-[13.5px] font-bold transition-colors mob:px-3.5 ${
              tab === t.key ? "bg-white text-blush-dark" : "bg-transparent text-ink-4 hover:text-ink-2"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "productos" && <ProductsTab products={data.products} categories={data.categories} run={run} readOnly={readOnly} />}
        {tab === "categorias" && <CategoriesTab categories={data.categories} products={data.products} run={run} readOnly={readOnly} />}
        {tab === "galeria" && <GalleryTab gallery={data.gallery} products={data.products} run={run} readOnly={readOnly} />}
        {tab === "resenas" && <ReviewsTab reviews={data.reviews} products={data.products} run={run} readOnly={readOnly} />}
        {tab === "cotizaciones" && <LeadsTab leads={data.leads} run={run} readOnly={readOnly} />}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-24 left-1/2 z-70 -translate-x-1/2 animate-pm-zoom rounded-xl border px-5 py-3 text-sm font-semibold shadow-lg ${
            toast.ok ? "border-ok-line bg-ok-bg text-ok-text" : "border-danger-line bg-danger-bg text-danger-text"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

function Stat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-5 py-[18px]">
      <div className="font-display text-[34px] font-semibold leading-none" style={{ color }}>
        {n}
      </div>
      <div className="mt-1 text-[13px] font-semibold text-ink-4">{label}</div>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminDashboard, type AdminData } from "@/components/admin/AdminDashboard";
import { getAdmin } from "@/lib/auth";
import { PRODUCT_COLS, toCategory, toGallery, toLead, toProduct, toReview } from "@/lib/db-map";
import { SEED_CATEGORIES, SEED_GALLERY, SEED_PRODUCTS, SEED_REVIEWS } from "@/lib/seed";
import { sessionClient } from "@/lib/supabase/clients";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Panel administrativo",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="pm-container max-w-[1180px] pb-[60px] pt-9">
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-3xl bg-warm" aria-busy="true" />}>
        <AdminLoader />
      </Suspense>
    </main>
  );
}

async function AdminLoader() {
  if (!isSupabaseConfigured) {
    const data: AdminData = {
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      gallery: SEED_GALLERY,
      reviews: SEED_REVIEWS,
      leads: [],
    };
    return <AdminDashboard data={data} email="modo demo" readOnly />;
  }

  const admin = await getAdmin();
  if (!admin) {
    const sb = await sessionClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    // Usuario autenticado pero sin permisos: no lo devolvemos al login (evita bucles).
    return (
      <div className="mx-auto my-10 max-w-[460px] rounded-3xl border border-line bg-white p-9 text-center">
        <h1 className="mb-2 font-display text-[28px] font-semibold">Sin permisos</h1>
        <p className="mb-6 text-sm text-ink-4">La cuenta {user.email} no está registrada como administradora.</p>
        <form action={signOut}>
          <button className="rounded-xl border border-danger-line bg-danger-bg px-5 py-3 text-sm font-bold text-danger-text">Cerrar sesión</button>
        </form>
      </div>
    );
  }

  const db = await sessionClient();
  const [p, c, g, r, l] = await Promise.all([
    db.from("products").select(PRODUCT_COLS).order("sort_order").order("created_at", { ascending: false }),
    db.from("categories").select("key,label,sort_order").order("sort_order").order("label"),
    db.from("gallery_items").select("id,title,occasion,product_id,image_url,height,sort_order").order("sort_order").order("created_at", { ascending: false }),
    db.from("reviews").select("id,product_id,name,stars,body,status,created_at").order("created_at", { ascending: false }),
    db.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  const err = p.error || c.error || g.error || r.error || l.error;
  if (err) throw new Error(`Supabase: ${err.message}`);

  const data: AdminData = {
    products: (p.data ?? []).map(toProduct),
    categories: (c.data ?? []).map(toCategory),
    gallery: (g.data ?? []).map(toGallery),
    reviews: (r.data ?? []).map(toReview),
    leads: (l.data ?? []).map(toLead),
  };
  return <AdminDashboard data={data} email={admin.email} />;
}

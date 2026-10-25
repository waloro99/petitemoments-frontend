import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminDashboard, type AdminData } from "@/components/admin/AdminDashboard";
import { getAdmin } from "@/lib/auth";
import { PRODUCT_COLS, toCategory, toGallery, toLead, toProduct, toReview } from "@/lib/db-map";
import { SEED_CATEGORIES, SEED_GALLERY, SEED_PRODUCTS, SEED_REVIEWS } from "@/lib/seed";
import { serviceClient } from "@/lib/supabase/clients";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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

const demoData = (): AdminData => ({
  products: SEED_PRODUCTS,
  categories: SEED_CATEGORIES,
  gallery: SEED_GALLERY,
  reviews: SEED_REVIEWS,
  leads: [],
});

async function AdminLoader() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  if (!isSupabaseConfigured) {
    return (
      <AdminDashboard
        data={demoData()}
        username={admin.username}
        readOnly="Modo demo: la base de datos aún no está conectada. Puedes recorrer el panel; los cambios se podrán guardar cuando se configure Supabase."
      />
    );
  }

  const db = serviceClient();
  if (!db) {
    return <AdminDashboard data={demoData()} username={admin.username} readOnly="Falta SUPABASE_SECRET_KEY en las variables de entorno: el panel no puede leer ni guardar datos." />;
  }

  const [p, c, g, r, l] = await Promise.all([
    db.from("products").select(PRODUCT_COLS).order("sort_order").order("created_at", { ascending: false }),
    db.from("categories").select("key,label,sort_order").order("sort_order").order("label"),
    db.from("gallery_items").select("id,title,occasion,product_id,image_url,height,sort_order").order("sort_order").order("created_at", { ascending: false }),
    db.from("reviews").select("id,product_id,name,stars,body,status,created_at").order("created_at", { ascending: false }),
    db.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  const err = p.error || c.error || g.error || r.error || l.error;
  if (err) {
    console.error("[admin] Supabase:", err.message);
    return (
      <AdminDashboard
        data={demoData()}
        username={admin.username}
        readOnly={`No se pudo leer la base de datos (${err.message}). ¿Ya ejecutaste supabase/setup.sql? Mostrando datos demo.`}
      />
    );
  }

  const data: AdminData = {
    products: (p.data ?? []).map(toProduct),
    categories: (c.data ?? []).map(toCategory),
    gallery: (g.data ?? []).map(toGallery),
    reviews: (r.data ?? []).map(toReview),
    leads: (l.data ?? []).map(toLead),
  };
  return <AdminDashboard data={data} username={admin.username} />;
}

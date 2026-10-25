"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { discardUploads, type ProductDraft, deleteProduct, saveProduct } from "@/app/admin/actions";
import { CloseIcon, ImagePlaceholderIcon, PlusIcon, UploadIcon } from "@/components/icons";
import { Media } from "@/components/Media";
import { BADGES, BUDGETS, OCCASIONS, STYLES } from "@/lib/config";
import type { Category, Product } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { AdminField, adminH2, btn, Chip, DeleteButton, type Run } from "./shared";

type Draft = ProductDraft & { incluyeText: string; personalizableText: string; opcionalesText: string };

const toDraft = (p: Product): Draft => ({
  ...p,
  incluyeText: p.incluye.join("\n"),
  personalizableText: p.personalizable.join("\n"),
  opcionalesText: p.opcionales.join("\n"),
});

const emptyDraft = (cat: string, sort: number): Draft => ({
  id: null,
  name: "",
  cat,
  occ: [],
  style: [],
  budget: "medio",
  priceLabel: "A cotizar",
  badge: null,
  blurb: "",
  longDesc: "",
  recomendado: "Cualquier celebración especial.",
  incluye: [],
  personalizable: [],
  opcionales: [],
  incluyeText: "",
  personalizableText: "Colores\nTemática",
  opcionalesText: "Entrega\nMontaje",
  tiempo: "1 a 2 semanas de anticipación",
  images: [],
  active: true,
  featured: false,
  sort,
});

const splitLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export function ProductsTab({
  products,
  categories,
  run,
  readOnly,
}: {
  products: Product[];
  categories: Category[];
  run: Run;
  readOnly?: boolean;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fresh = useRef<string[]>([]); // fotos subidas en esta edición
  const catLabel = (k: string) => categories.find((c) => c.key === k)?.label ?? k;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const toggle = (k: "occ" | "style", v: string) =>
    setDraft((d) => (d ? { ...d, [k]: d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v] } : d));

  const open = (d: Draft) => {
    closeDraft();
    setDraft(d);
    setUploadErr(null);
  };

  const closeDraft = () => {
    if (fresh.current.length) {
      const urls = fresh.current;
      fresh.current = [];
      void discardUploads(urls);
    }
    setDraft(null);
  };

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length || !draft) return;
    setUploading(true);
    setUploadErr(null);
    try {
      for (const f of files) {
        const { url } = await uploadImage(f, "products", draft.name || "producto");
        fresh.current.push(url);
        setDraft((d) => (d ? { ...d, images: [...d.images, url] } : d));
      }
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setUploadErr("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    const payload: ProductDraft = {
      ...draft,
      incluye: splitLines(draft.incluyeText),
      personalizable: splitLines(draft.personalizableText),
      opcionales: splitLines(draft.opcionalesText),
      images: draft.images.length ? draft.images : ["placeholder:0", "placeholder:2", "placeholder:4"],
    };
    const ok = await run(() => saveProduct(payload), draft.id ? "Producto actualizado." : "Producto creado.");
    setSaving(false);
    if (ok) {
      fresh.current = [];
      setDraft(null);
    }
  };

  const activeCount = products.filter((p) => p.active).length;

  return (
    <div className="grid grid-cols-[1fr_380px] items-start gap-[26px] tab:grid-cols-1">
      {/* Lista */}
      <div>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h2 className={adminH2}>
            Productos ({products.length}
            {activeCount !== products.length ? ` · ${activeCount} visibles` : ""})
          </h2>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => open(emptyDraft(categories[0]?.key ?? "", products.length))}
            className={`${btn.primary} inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[13px]`}
          >
            <PlusIcon />
            Nuevo producto
          </button>
        </div>
        <ul className="flex flex-col gap-2.5">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3.5 rounded-[14px] border bg-white px-3.5 py-3"
              style={{ borderColor: draft?.id === p.id ? "#C0808C" : "#EEE2D6", opacity: p.active ? 1 : 0.62 }}
            >
              <span className="relative h-16 w-[52px] flex-none overflow-hidden rounded-[9px]">
                <Media src={p.images[0]} alt="" sizes="52px" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold text-ink">
                  {p.name}
                  {!p.active && <span className="ml-2 rounded-full bg-warm2 px-2 py-0.5 text-[10.5px] font-bold text-mocha">Oculto</span>}
                </div>
                <div className="mt-0.5 text-xs text-ink-4">
                  {catLabel(p.cat)} · {p.priceLabel} · {p.images.length} img{p.badge ? ` · ${p.badge}` : ""}
                </div>
              </div>
              <Link href={`/producto/${p.slug}`} target="_blank" className="flex-none text-xs font-bold text-blush hover:underline mob:hidden">
                Ver
              </Link>
              <button type="button" onClick={() => open(toDraft(p))} className={`${btn.soft} flex-none px-3 py-2 text-[12.5px]`}>
                Editar
              </button>
              <DeleteButton
                label={`Eliminar ${p.name}`}
                disabled={readOnly}
                onConfirm={() => {
                  if (draft?.id === p.id) setDraft(null);
                  void run(() => deleteProduct(p.id), "Producto eliminado.");
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="sticky top-24 tab:static">
        {draft ? (
          <div className="rounded-[18px] border border-line bg-white p-[22px] shadow-[0_12px_30px_-20px_rgba(109,74,82,.3)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[22px] font-semibold">{draft.id ? "Editar producto" : "Nuevo producto"}</h3>
              <button type="button" onClick={closeDraft} aria-label="Cerrar editor" className="grid h-9 w-9 place-items-center text-ink-4">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="flex max-h-[calc(100vh-200px)] flex-col gap-[13px] overflow-y-auto pr-1 tab:max-h-none">
              <AdminField label="Nombre" req>
                <input value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Nombre del producto" maxLength={120} className="pm-input pm-input-sm" />
              </AdminField>
              <div className="grid grid-cols-2 gap-3 tab:grid-cols-1">
                <AdminField label="Categoría">
                  <select value={draft.cat} onChange={(e) => set("cat", e.target.value)} className="pm-input pm-input-sm">
                    {categories.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </AdminField>
                <AdminField label="Precio / etiqueta">
                  <input value={draft.priceLabel} onChange={(e) => set("priceLabel", e.target.value)} placeholder="Desde Q___ o A cotizar" className="pm-input pm-input-sm" />
                </AdminField>
                <AdminField label="Presupuesto">
                  <select value={draft.budget} onChange={(e) => set("budget", e.target.value as Draft["budget"])} className="pm-input pm-input-sm">
                    {Object.entries(BUDGETS).map(([k, l]) => (
                      <option key={k} value={k}>{l}</option>
                    ))}
                  </select>
                </AdminField>
                <AdminField label="Distintivo">
                  <select value={draft.badge ?? ""} onChange={(e) => set("badge", e.target.value || null)} className="pm-input pm-input-sm">
                    <option value="">Ninguno</option>
                    {BADGES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </AdminField>
              </div>
              <AdminField label="Descripción corta">
                <textarea value={draft.blurb} onChange={(e) => set("blurb", e.target.value)} rows={2} maxLength={220} placeholder="Frase breve para la card" className="pm-input pm-input-sm resize-y" />
              </AdminField>
              <AdminField label="Descripción completa">
                <textarea value={draft.longDesc} onChange={(e) => set("longDesc", e.target.value)} rows={3} placeholder="Texto para la página de detalle" className="pm-input pm-input-sm resize-y" />
              </AdminField>
              <AdminField label="Recomendado para">
                <input value={draft.recomendado} onChange={(e) => set("recomendado", e.target.value)} className="pm-input pm-input-sm" />
              </AdminField>
              <AdminField label="Qué incluye (una línea por ítem)">
                <textarea value={draft.incluyeText} onChange={(e) => set("incluyeText", e.target.value)} rows={3} placeholder={"Montaje en sitio\nGlobos en tu paleta"} className="pm-input pm-input-sm resize-y" />
              </AdminField>
              <div className="grid grid-cols-2 gap-3 tab:grid-cols-1">
                <AdminField label="Personalizable (por línea)">
                  <textarea value={draft.personalizableText} onChange={(e) => set("personalizableText", e.target.value)} rows={3} className="pm-input pm-input-sm resize-y" />
                </AdminField>
                <AdminField label="Opcionales (por línea)">
                  <textarea value={draft.opcionalesText} onChange={(e) => set("opcionalesText", e.target.value)} rows={3} className="pm-input pm-input-sm resize-y" />
                </AdminField>
              </div>
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <AdminField label="Reserva recomendada">
                  <input value={draft.tiempo} onChange={(e) => set("tiempo", e.target.value)} placeholder="5 a 7 días de anticipación" className="pm-input pm-input-sm" />
                </AdminField>
                <AdminField label="Orden">
                  <input type="number" value={draft.sort} onChange={(e) => set("sort", Number(e.target.value))} className="pm-input pm-input-sm" />
                </AdminField>
              </div>
              <div>
                <span className="mb-[7px] block text-[12.5px] font-bold text-ink-2">Ocasiones</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(OCCASIONS).map(([k, l]) => (
                    <Chip key={k} small active={draft.occ.includes(k)} onClick={() => toggle("occ", k)}>{l}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-[7px] block text-[12.5px] font-bold text-ink-2">Estilos</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(STYLES).map(([k, l]) => (
                    <Chip key={k} small active={draft.style.includes(k)} onClick={() => toggle("style", k)}>{l}</Chip>
                  ))}
                </div>
              </div>

              {/* Gestor de imágenes */}
              <div>
                <span className="mb-2 block text-[12.5px] font-bold text-ink-2">Imágenes ({draft.images.length})</span>
                <div className="mb-2.5 grid grid-cols-4 gap-2">
                  {draft.images.map((im, i) => (
                    <div key={im + i} className="relative aspect-square overflow-hidden rounded-[9px] border border-line-warm">
                      <Media src={im} alt="" sizes="80px" />
                      {i === 0 ? (
                        <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 text-[9px] font-extrabold uppercase text-blush-dark">Portada</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => set("images", [im, ...draft.images.filter((_, j) => j !== i)])}
                          className="absolute bottom-1 left-1 rounded-full bg-white/85 px-1.5 text-[9px] font-bold text-mocha hover:bg-white"
                        >
                          Portada
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => set("images", draft.images.filter((_, j) => j !== i))}
                        aria-label={`Quitar imagen ${i + 1}`}
                        className="absolute right-[3px] top-[3px] grid h-5 w-5 place-items-center rounded-full bg-[rgba(74,47,53,.7)] text-[13px] leading-none text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label
                    className={`grid aspect-square place-items-center rounded-[9px] border-2 border-dashed border-line-dash bg-chip text-champagne hover:bg-warm ${readOnly || uploading ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <input type="file" accept="image/*" multiple onChange={onFiles} className="sr-only" disabled={readOnly || uploading} />
                    <span className="text-center text-[10px] font-bold leading-[1.3]">
                      <UploadIcon className="mx-auto mb-[3px] block" />
                      {uploading ? "Subiendo…" : "Subir"}
                    </span>
                  </label>
                </div>
                <div className="text-[11px] leading-[1.4] text-ink-5">
                  Sugerido: vertical 4:5 o cuadrado 1:1. Se optimizan al subir. Si no subes imágenes, se usa un fondo decorativo.
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-[13px] font-semibold text-ink-2">
                <input type="checkbox" checked={draft.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-[#C0808C]" />
                Visible en el catálogo
              </label>

              {uploadErr && <div role="alert" className="text-[13px] font-semibold text-error">{uploadErr}</div>}

              <div className="mt-1.5 flex gap-[9px]">
                <button type="button" onClick={save} disabled={saving || uploading || readOnly} className={`${btn.primary} flex-1 p-[13px] text-sm font-extrabold`}>
                  {saving ? "Guardando…" : "Guardar"}
                </button>
                <button type="button" onClick={closeDraft} className={`${btn.soft} flex-none rounded-[11px] px-[18px] py-[13px] text-sm`}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#E0CBBB] bg-warm px-6 py-[34px] text-center text-[#9A8272]">
            <div className="mb-3 flex justify-center text-[#C0A08C]">
              <ImagePlaceholderIcon />
            </div>
            <p className="m-0 text-sm leading-normal">Selecciona un producto para editarlo o crea uno nuevo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

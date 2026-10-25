"use client";
import { useState } from "react";
import { addGalleryItem, deleteGalleryItem, discardUploads, updateGalleryItem } from "@/app/admin/actions";
import { UploadIcon } from "@/components/icons";
import { Media } from "@/components/Media";
import { OCCASIONS, occLabel } from "@/lib/config";
import type { GalleryItem, Product } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { AdminField, adminH2, btn, DeleteButton, type Run } from "./shared";

export function GalleryTab({ gallery, products, run, readOnly }: { gallery: GalleryItem[]; products: Product[]; run: Run; readOnly?: boolean }) {
  const [title, setTitle] = useState("");
  const [occ, setOcc] = useState("infantil");
  const [pid, setPid] = useState<string>(products[0]?.id ?? "");
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reset = () => {
    setEditing(null);
    setTitle("");
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    setErr(null);
    try {
      const { url, width, height } = await uploadImage(f, "gallery", title || occLabel(occ));
      // Altura del mosaico según la proporción real de la foto (200–300 px).
      const h = Math.min(300, Math.max(200, Math.round((260 * height) / width)));
      const ok = await run(() => addGalleryItem({ title, occ, pid: pid || null, imageUrl: url, h }), "Foto agregada a la galería.");
      if (ok) setTitle("");
      else void discardUploads([url]);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "No se pudo subir la foto.");
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (await run(() => updateGalleryItem(editing, { title, occ, pid: pid || null }), "Foto actualizada.")) reset();
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className={`${adminH2} mb-1`}>Imágenes de la galería</h2>
        <p className="text-sm text-ink-4">Sube fotos de trabajos reales y clasifícalas por ocasión. Vincula un producto para que sus reseñas aparezcan sobre la foto.</p>
      </div>
      <div className="mb-[22px] grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3 rounded-2xl border border-line bg-white p-[18px] tab:grid-cols-1">
        <AdminField label="Título">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Cumpleaños temático safari" maxLength={120} className="pm-input pm-input-sm" />
        </AdminField>
        <AdminField label="Ocasión">
          <select value={occ} onChange={(e) => setOcc(e.target.value)} className="pm-input pm-input-sm">
            {Object.entries(OCCASIONS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Producto vinculado (para reseñas)">
          <select value={pid} onChange={(e) => setPid(e.target.value)} className="pm-input pm-input-sm">
            <option value="">Ninguno</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </AdminField>
        {editing ? (
          <div className="flex gap-2">
            <button type="button" onClick={saveEdit} disabled={readOnly} className={`${btn.primary} whitespace-nowrap px-4 py-3 text-sm`}>
              Guardar cambios
            </button>
            <button type="button" onClick={reset} className={`${btn.soft} rounded-[11px] px-3 py-3 text-sm`}>
              Cancelar
            </button>
          </div>
        ) : (
          <label
            className={`${btn.primary} inline-flex cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap px-5 py-3 text-sm ${readOnly || busy ? "pointer-events-none opacity-60" : ""}`}
          >
            <UploadIcon size={16} />
            {busy ? "Subiendo…" : "Subir foto"}
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" disabled={readOnly || busy} />
          </label>
        )}
      </div>
      {err && <div role="alert" className="-mt-3 mb-4 text-[13px] font-semibold text-error">{err}</div>}

      <ul className="columns-3 gap-3.5 tab:columns-2 mob:columns-1">
        {gallery.map((g) => (
          <li
            key={g.id}
            className="relative mb-3.5 break-inside-avoid overflow-hidden rounded-[14px] border"
            style={{ height: g.h, borderColor: editing === g.id ? "#C0808C" : "#EEE2D6" }}
          >
            <Media src={g.img} alt={g.title} sizes="(max-width:640px) 100vw, 380px" />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(74,47,53,.45))]" />
            <span className="absolute bottom-2.5 left-[11px] right-12 text-[13px] font-bold leading-[1.2] text-white">
              {g.title}
              <br />
              <span className="text-[10px] font-semibold opacity-85">
                {occLabel(g.occ)}
                {g.pid ? ` · ${products.find((p) => p.id === g.pid)?.name ?? ""}` : ""}
              </span>
            </span>
            <div className="absolute right-[9px] top-[9px] flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEditing(g.id);
                  setTitle(g.title);
                  setOcc(g.occ);
                  setPid(g.pid ?? "");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full bg-[rgba(74,47,53,.72)] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[rgba(74,47,53,.9)]"
              >
                Editar
              </button>
              <DeleteButton size={30} iconSize={15} label={`Eliminar ${g.title}`} disabled={readOnly} onConfirm={() => void run(() => deleteGalleryItem(g.id), "Foto eliminada.")} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

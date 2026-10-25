"use client";
import { useState } from "react";
import { addCategory, deleteCategory } from "@/app/admin/actions";
import { TagIcon } from "@/components/icons";
import type { Category, Product } from "@/lib/types";
import { adminH2, btn, DeleteButton, type Run } from "./shared";

export function CategoriesTab({ categories, products, run, readOnly }: { categories: Category[]; products: Product[]; run: Run; readOnly?: boolean }) {
  const [label, setLabel] = useState("");
  const add = async () => {
    if (!label.trim()) return;
    if (await run(() => addCategory(label), "Categoría agregada.")) setLabel("");
  };
  return (
    <div className="max-w-[620px]">
      <h2 className={`${adminH2} mb-1.5`}>Categorías</h2>
      <p className="mb-[18px] text-sm text-ink-4">Las categorías se usan como filtros del catálogo y al clasificar productos.</p>
      <div className="mb-5 flex gap-[9px]">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nueva categoría (ej. Letras y números)"
          maxLength={80}
          aria-label="Nueva categoría"
          className="pm-input pm-input-sm flex-1 rounded-[11px] py-3"
        />
        <button type="button" onClick={add} disabled={readOnly} className={`${btn.primary} px-5 py-3 text-sm`}>
          Agregar
        </button>
      </div>
      <ul className="flex flex-col gap-[9px]">
        {categories.map((c) => {
          const count = products.filter((p) => p.cat === c.key).length;
          return (
            <li key={c.key} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-[13px]">
              <div className="flex min-w-0 flex-wrap items-center gap-[11px]">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-rose-soft text-blush">
                  <TagIcon />
                </span>
                <span className="text-[14.5px] font-bold text-ink">{c.label}</span>
                <span className="text-xs text-ink-5">
                  {count} producto{count === 1 ? "" : "s"}
                </span>
              </div>
              <DeleteButton label={`Eliminar ${c.label}`} disabled={readOnly} onConfirm={() => void run(() => deleteCategory(c.key), "Categoría eliminada.")} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

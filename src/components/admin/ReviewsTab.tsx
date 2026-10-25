"use client";
import { approveReview, deleteReview } from "@/app/admin/actions";
import type { Product, Review } from "@/lib/types";
import { adminH2, btn, DeleteButton, fmtDateTime, type Run, starsText } from "./shared";

export function ReviewsTab({ reviews, products, run, readOnly }: { reviews: Review[]; products: Product[]; run: Run; readOnly?: boolean }) {
  const prodName = (id: string) => products.find((p) => p.id === id)?.name ?? "Producto eliminado";
  const pending = reviews.filter((r) => r.status === "pending");
  const published = reviews.filter((r) => r.status === "published");

  return (
    <div className="grid grid-cols-2 items-start gap-[26px] tab:grid-cols-1">
      <section>
        <h2 className={`${adminH2} mb-1`}>Pendientes de aprobación ({pending.length})</h2>
        <p className="mb-4 text-[13.5px] text-ink-4">Las reseñas con menos de 4 estrellas se revisan aquí antes de publicarse.</p>
        <div className="flex flex-col gap-2.5">
          {pending.map((r) => (
            <article key={r.id} className="rounded-[14px] border border-wait-line bg-white px-[18px] py-4">
              <Head r={r} prod={prodName(r.pid)} />
              <p className="mb-3 text-[13.5px] leading-[1.55] text-ink-3">{r.text}</p>
              <div className="flex gap-2">
                <button type="button" disabled={readOnly} onClick={() => void run(() => approveReview(r.id), "Reseña publicada.")} className={`${btn.primary} rounded-[9px] px-3.5 py-[9px] text-[12.5px]`}>
                  Aprobar y publicar
                </button>
                <DeleteButton text="Eliminar" disabled={readOnly} onConfirm={() => void run(() => deleteReview(r.id), "Reseña eliminada.")} />
              </div>
            </article>
          ))}
          {pending.length === 0 && (
            <div className="rounded-[14px] border border-dashed border-[#E0CBBB] bg-warm p-[22px] text-center text-[13.5px] text-[#9A8272]">
              No hay reseñas pendientes de revisión.
            </div>
          )}
        </div>
      </section>
      <section>
        <h2 className={`${adminH2} mb-1`}>Publicadas ({published.length})</h2>
        <p className="mb-4 text-[13.5px] text-ink-4">Las reseñas de 4 y 5 estrellas se publican automáticamente en el sitio.</p>
        <div className="flex flex-col gap-2.5">
          {published.map((r) => (
            <article key={r.id} className="rounded-[14px] border border-line bg-white px-[18px] py-4">
              <Head
                r={r}
                prod={prodName(r.pid)}
                action={<DeleteButton size={28} iconSize={13} label="Eliminar reseña" disabled={readOnly} onConfirm={() => void run(() => deleteReview(r.id), "Reseña eliminada.")} />}
              />
              <p className="m-0 text-[13.5px] leading-[1.55] text-ink-3">{r.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Head({ r, prod, action }: { r: Review; prod: string; action?: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2.5">
      <div>
        <span className="text-sm font-extrabold text-ink">{r.name}</span>
        <span className="text-xs text-ink-5"> · {prod}</span>
        <div className="text-[11px] text-ink-5">{fmtDateTime(r.createdAt)}</div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-sm tracking-[2px] text-star" aria-label={`${r.stars} de 5`}>{starsText(r.stars)}</span>
        {action}
      </div>
    </div>
  );
}

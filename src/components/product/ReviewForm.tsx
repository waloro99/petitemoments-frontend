"use client";
import { useRef, useState, useTransition } from "react";
import { submitReview } from "@/app/actions";

export function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState<null | "published" | "pending">(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const honeypot = useRef<HTMLInputElement>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    if (!name.trim() || !text.trim()) {
      setError("Escribe tu nombre y tu experiencia.");
      return;
    }
    start(async () => {
      const res = await submitReview({ productId, name, stars, text, website: honeypot.current?.value });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setFeedback(res.status);
      setName("");
      setText("");
      setStars(5);
    });
  };

  // Radiogroup accesible: flechas cambian la calificación.
  const onStarKey = (e: React.KeyboardEvent) => {
    let next = stars;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(5, stars + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(1, stars - 1);
    else return;
    e.preventDefault();
    setStars(next);
    radios.current[next - 1]?.focus();
  };

  return (
    <form onSubmit={onSubmit} className="rounded-[18px] border border-line bg-white p-[22px]" noValidate>
      <h3 className="mb-[5px] font-display text-[22px] font-semibold">Deja tu reseña</h3>
      <p className="mb-4 text-[13px] leading-normal text-ink-4">¿Ya celebraste con este producto? Cuéntanos cómo te fue.</p>

      <div aria-live="polite">
        {feedback === "published" && (
          <div className="mb-3.5 rounded-[11px] border border-ok-line bg-ok-bg px-3.5 py-[11px] text-[13px] font-semibold text-ok-text">
            ¡Gracias! Tu reseña ya está publicada.
          </div>
        )}
        {feedback === "pending" && (
          <div className="mb-3.5 rounded-[11px] border border-wait-line bg-wait-bg px-3.5 py-[11px] text-[13px] font-semibold text-wait-text">
            ¡Gracias! Tu reseña será revisada por el equipo antes de publicarse.
          </div>
        )}
        {error && (
          <div role="alert" className="mb-3.5 rounded-[11px] border border-danger-line bg-danger-bg px-3.5 py-[11px] text-[13px] font-semibold text-danger-text">
            {error}
          </div>
        )}
      </div>

      <label className="mb-[13px] flex flex-col gap-1.5">
        <span className="pm-label">Tu nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" maxLength={60} required className="pm-input pm-input-sm" />
      </label>

      <div className="mb-[13px]">
        <span id="rating-label" className="pm-label mb-1.5 block">Calificación</span>
        <div role="radiogroup" aria-labelledby="rating-label" className="flex gap-[3px]" onKeyDown={onStarKey}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              ref={(el) => {
                radios.current[n - 1] = el;
              }}
              type="button"
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
              tabIndex={stars === n ? 0 : -1}
              onClick={() => setStars(n)}
              className="grid h-11 w-9 place-items-center rounded-md text-[29px] leading-none"
              style={{ color: n <= stars ? "#D9A441" : "#E3D2C4" }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <label className="mb-[15px] flex flex-col gap-1.5">
        <span className="pm-label">Tu experiencia</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={1200}
          placeholder="Cuéntanos cómo quedó tu evento..."
          required
          className="pm-input pm-input-sm resize-y"
        />
      </label>

      {/* Honeypot: invisible para personas */}
      <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blush p-3.5 text-[14.5px] font-extrabold text-white transition-colors hover:bg-blush-dark disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Publicar reseña"}
      </button>
      <div className="mt-[11px] text-center text-[11.5px] leading-[1.45] text-ink-5">
        Las reseñas de 4★ o más se publican al instante; las demás pasan por revisión del equipo.
      </div>
    </form>
  );
}

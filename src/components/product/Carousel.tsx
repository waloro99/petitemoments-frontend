"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { Media } from "@/components/Media";

/**
 * Carrusel del detalle: autoplay cada 4.5 s (solo con más de una imagen),
 * pausa con hover/foco, respeta prefers-reduced-motion.
 */
export function Carousel({ images, alt, catLabel }: { images: string[]; alt: string; catLabel: string }) {
  const imgs = images.length ? images : ["placeholder:0"];
  const n = imgs.length;
  const [slide, setSlide] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (n < 2 || hover || focus || reduced) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n, hover, focus, reduced]);

  const cur = Math.min(slide, n - 1);
  const go = (i: number) => setSlide(((i % n) + n) % n);

  return (
    <div className="sticky top-24 tab:static">
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label={`Fotos de ${alt}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#EFE2D8] shadow-[0_24px_50px_-28px_rgba(109,74,82,.4)]"
      >
        <div
          className="flex h-full w-full transition-transform duration-[550ms] ease-[cubic-bezier(.4,0,.2,1)]"
          style={{ transform: `translateX(${-cur * 100}%)` }}
        >
          {imgs.map((src, i) => (
            <div
              key={i}
              className="relative h-full min-w-full overflow-hidden"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${n}`}
              aria-hidden={i !== cur}
            >
              <Media src={src} alt={`${alt} – foto ${i + 1}`} sizes="(max-width:1000px) 100vw, 560px" priority={i === 0} />
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(255,255,255,.32),transparent_55%)]" />
            </div>
          ))}
        </div>
        <span className="absolute left-3.5 top-3.5 z-[2] rounded-full bg-white px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[.08em] text-blush-dark">
          {catLabel}
        </span>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(cur - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 z-[2] grid h-[42px] w-[42px] -translate-y-1/2 place-items-center rounded-full bg-white/90 text-mocha shadow-[0_6px_16px_-6px_rgba(109,74,82,.4)] hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(cur + 1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 z-[2] grid h-[42px] w-[42px] -translate-y-1/2 place-items-center rounded-full bg-white/90 text-mocha shadow-[0_6px_16px_-6px_rgba(109,74,82,.4)] hover:bg-white"
            >
              <ChevronRight />
            </button>
            <div className="absolute inset-x-0 bottom-3.5 z-[2] flex justify-center gap-[7px]">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={i === cur ? "true" : undefined}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ width: i === cur ? 22 : 8, background: i === cur ? "#fff" : "rgba(255,255,255,.5)" }}
                />
              ))}
            </div>
          </>
        )}
        <p className="sr-only" aria-live="polite">
          Foto {cur + 1} de {n}
        </p>
      </div>
      {n > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {imgs.slice(0, 8).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Mostrar foto ${i + 1}`}
              className="relative aspect-square overflow-hidden rounded-xl border-2 p-0 transition-colors"
              style={{ borderColor: i === cur ? "#C0808C" : "transparent" }}
            >
              <Media src={src} alt="" sizes="130px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

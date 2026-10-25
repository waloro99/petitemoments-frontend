"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CloseIcon, ExpandIcon, WhatsAppIcon } from "@/components/icons";
import { Media } from "@/components/Media";
import { useModal } from "@/lib/useModal";
import { WA_MSG, waLink } from "@/lib/whatsapp";

export type GalleryCard = {
  id: string;
  title: string;
  occLabel: string;
  img: string;
  h: number;
  badge: string | null;
  reviews: { id: string; name: string; stars: number; text: string }[];
};

const stars = (n: number) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

export function GalleryGrid({ items }: { items: GalleryCard[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="columns-3 gap-4 tab:columns-2 mob:columns-1">
        {items.map((g, i) => (
          <li key={g.id} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Ver en grande: ${g.title}`}
              className="relative block w-full overflow-hidden rounded-2xl p-0 transition-[filter] hover:brightness-[.97]"
              style={{ height: g.h }}
            >
              <Media src={g.img} alt={`${g.title} – ${g.occLabel} en Guatemala`} sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 400px" priority={i < 3} />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(74,47,53,.42))]" />
              <span className="absolute bottom-3 left-[13px] text-left">
                <span className="block font-display text-[19px] font-semibold leading-[1.1] text-white">{g.title}</span>
                <span className="mt-[5px] inline-block rounded-full bg-white/90 px-[9px] py-[3px] text-[10px] font-bold tracking-[.06em] text-[#7A4A50]">
                  {g.occLabel}
                </span>
              </span>
              {g.badge && (
                <span className="absolute left-[11px] top-[11px] rounded-full bg-white/92 px-2.5 py-1 text-[10.5px] font-extrabold text-[#7A4A50]">
                  ★ {g.badge}
                </span>
              )}
              <span className="absolute right-[11px] top-[11px] grid h-[30px] w-[30px] place-items-center rounded-full bg-white/85 text-blush-dark" aria-hidden>
                <ExpandIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && items[open] && (
        <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: GalleryCard[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useModal<HTMLDivElement>(true, onClose);
  const n = items.length;
  const item = items[index];
  const move = (d: number) => onIndex((((index + d) % n) + n) % n);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      tabIndex={-1}
      onKeyDown={onKey}
      onClick={onClose}
      className="fixed inset-0 z-80 flex animate-pm-fade items-center justify-center bg-[rgba(45,30,32,.82)] p-7 outline-none backdrop-blur-[6px]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-[22px] top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/28"
      >
        <CloseIcon />
      </button>
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            aria-label="Foto anterior"
            className="absolute left-[18px] top-1/2 z-[1] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/28 mob:left-2"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            aria-label="Foto siguiente"
            className="absolute right-[18px] top-1/2 z-[1] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/28 mob:right-2"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      <div onClick={(e) => e.stopPropagation()} className="max-h-full w-[min(560px,90vw)] animate-[pmZoom_.28s_ease] overflow-y-auto">
        <div className="relative aspect-[4/5] max-h-[68vh] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-20px_rgba(0,0,0,.6)] mx-auto">
          <Media src={item.img} alt={`${item.title} – ${item.occLabel}`} sizes="560px" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3.5 text-white">
          <div>
            <div className="font-display text-[22px] font-semibold">{item.title}</div>
            <div className="mt-0.5 text-xs opacity-75">{item.occLabel}</div>
          </div>
          <a
            href={waLink(WA_MSG.gallery(item.title))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-none items-center gap-2 rounded-xl bg-wa px-[18px] py-3 text-sm font-bold text-white hover:bg-wa-dark"
          >
            <WhatsAppIcon size={17} />
            Quiero algo así
          </a>
        </div>
        {item.reviews.length > 0 && (
          <div className="mt-3 flex max-h-40 flex-col gap-2 overflow-auto">
            {item.reviews.map((r) => (
              <div key={r.id} className="rounded-xl bg-white/12 px-3.5 py-[11px] text-white">
                <div className="flex justify-between gap-2.5 text-[12.5px] font-bold">
                  <span>{r.name}</span>
                  <span className="tracking-[2px] text-[#F3CF7A]" aria-label={`${r.stars} de 5`}>{stars(r.stars)}</span>
                </div>
                <p className="mt-1 text-[12.5px] leading-normal opacity-90">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

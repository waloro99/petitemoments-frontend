import Link from "next/link";
import { ImagesIcon, WhatsAppIcon } from "@/components/icons";
import { Media } from "@/components/Media";
import type { Product } from "@/lib/types";
import { WA_MSG, waLink } from "@/lib/whatsapp";

export function ProductCard({ p, catLabel, priority }: { p: Product; catLabel: string; priority?: boolean }) {
  const imgs = p.images.length ? p.images : ["placeholder:0"];
  const href = `/producto/${p.slug}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_6px_22px_-16px_rgba(109,74,82,.25)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_34px_-18px_rgba(109,74,82,.3)]">
      <Link href={href} className="relative block aspect-[4/5] w-full overflow-hidden" tabIndex={-1} aria-hidden>
        <Media src={imgs[0]} alt={`${p.name} – ${catLabel} en Guatemala`} sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 330px" priority={priority} />
        <span className="pm-veil" />
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-[5px] text-[10px] font-extrabold uppercase tracking-[.08em] text-blush-dark shadow-[0_4px_10px_-4px_rgba(109,74,82,.3)]">
            {p.badge}
          </span>
        )}
        {imgs.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-[5px] rounded-full bg-white/85 px-[9px] py-1 text-[10px] font-bold text-[#7A4A50]">
            <ImagesIcon />
            {imgs.length}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col px-[17px] pb-[17px] pt-4">
        <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[.08em] text-champagne">{catLabel}</div>
        <h3 className="mb-1.5 font-display text-[21px] font-semibold leading-[1.12]">
          <Link href={href} className="hover:text-blush-dark">{p.name}</Link>
        </h3>
        <p className="mb-3.5 flex-1 text-[13px] leading-normal text-ink-4">{p.blurb}</p>
        <div className="mb-[13px] text-[13px] font-extrabold text-ink-2">{p.priceLabel}</div>
        <div className="flex gap-2">
          <Link
            href={href}
            className="flex-1 rounded-[11px] border border-line-warm bg-warm p-2.5 text-center text-[13px] font-bold text-mocha transition-colors hover:bg-warm-hover"
          >
            Ver detalle
          </Link>
          <a
            href={waLink(WA_MSG.product(p.name))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Cotizar ${p.name} por WhatsApp`}
            className="grid w-11 flex-none place-items-center rounded-[11px] bg-wa text-white transition-colors hover:bg-wa-dark"
          >
            <WhatsAppIcon size={19} />
          </a>
        </div>
      </div>
    </article>
  );
}

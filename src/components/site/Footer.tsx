import Link from "next/link";
import { SITE } from "@/lib/config";
import { LogoLight } from "@/components/site/Logo";
import { WA_MSG, waLink } from "@/lib/whatsapp";

const heading = "mb-3.5 text-xs font-extrabold uppercase tracking-[.14em] text-footer-head";
const link = "text-sm text-footer-text transition-colors hover:text-white";

export { WhatsAppFloat } from "./WhatsAppFloat";

export function Footer() {
  return (
    <footer className="mt-16 bg-footer text-footer-text">
      <div className="pm-container grid max-w-[1240px] grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-10 pb-[30px] pt-[52px] tab:grid-cols-1 mob:grid-cols-2">
        <div className="mob:col-span-2">
          <div className="mb-4 flex items-center gap-[11px]">
            <LogoLight />
          </div>
          <p className="mb-[18px] max-w-[280px] text-sm leading-[1.6] text-footer-muted">
            Decoración, sorpresas y detalles para celebrar momentos especiales en Ciudad de Guatemala.
          </p>
          <a
            href={`https://instagram.com/${SITE.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-footer-dim hover:text-footer-text"
          >
            Instagram · @{SITE.instagram}
          </a>
        </div>
        <nav aria-label="Explora">
          <div className={heading}>Explora</div>
          <div className="flex flex-col gap-[11px]">
            <Link href="/catalogo" className={link}>Catálogo</Link>
            <Link href="/galeria" className={link}>Galería</Link>
            <Link href="/cotizar" className={link}>Cotizar</Link>
            <Link href="/admin" className="text-[13px] text-footer-dim transition-colors hover:text-footer-text">Panel administrativo</Link>
          </div>
        </nav>
        <div>
          <div className={heading}>Servicios</div>
          <ul className="flex flex-col gap-[11px] text-sm text-footer-muted">
            <li><Link href="/catalogo?categoria=globos" className="hover:text-white">Decoración con globos</Link></li>
            <li><Link href="/catalogo?categoria=sorpresas" className="hover:text-white">Sorpresas personalizadas</Link></li>
            <li><Link href="/catalogo?categoria=cake-toppers" className="hover:text-white">Cake toppers</Link></li>
            <li><Link href="/catalogo?categoria=personalizables" className="hover:text-white">Personalizables y juegos</Link></li>
          </ul>
        </div>
        <div>
          <div className={heading}>Contacto</div>
          <address className="flex flex-col gap-[11px] text-sm not-italic text-footer-muted">
            <a href={waLink(WA_MSG.floating)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp · {SITE.whatsappDisplay}
            </a>
            <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a>
            <span>{SITE.coverage}</span>
            <span>{SITE.hours}</span>
          </address>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="pm-container flex max-w-[1240px] flex-wrap justify-between gap-2 py-[18px] text-xs text-footer-faint">
          <span>© 2026 Petite Moments GT</span>
          <span>Decoración y detalles para eventos en Guatemala</span>
        </div>
      </div>
    </footer>
  );
}

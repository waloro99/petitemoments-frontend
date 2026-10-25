"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/site/Logo";
import { useModal } from "@/lib/useModal";
import { WA_MSG, waLink } from "@/lib/whatsapp";

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Galería", href: "/galeria" },
  { label: "Cotizar", href: "/cotizar" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(61,51,48,.08)] bg-[rgba(250,245,239,.86)] backdrop-blur-[12px]">
        <div className="pm-container flex h-[76px] max-w-[1240px] items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Principal" className="flex items-center gap-1 mob:hidden">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-full px-[14px] py-[9px] text-[14.5px] font-semibold tracking-[.01em] transition-colors hover:text-blush ${
                  isActive(n.href) ? "text-blush" : "text-ink-2"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <a
              href={waLink(WA_MSG.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-wa px-[18px] py-[11px] text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(37,211,102,.6)] transition-colors hover:bg-wa-dark"
            >
              <WhatsAppIcon size={17} />
              Cotizar
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="pm-drawer"
            className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[rgba(61,51,48,.14)] text-ink mob:flex"
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      {open && <Drawer onClose={() => setOpen(false)} isActive={isActive} />}
    </>
  );
}

function Drawer({ onClose, isActive }: { onClose: () => void; isActive: (h: string) => boolean }) {
  const ref = useModal<HTMLDivElement>(true, onClose);
  return (
    <div className="fixed inset-0 z-60 animate-pm-fade bg-[rgba(61,51,48,.35)]" onClick={onClose}>
      <div
        id="pm-drawer"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-[min(84vw,340px)] flex-col gap-1.5 overflow-auto bg-ivory px-6 py-[26px] shadow-[-20px_0_50px_-20px_rgba(61,51,48,.4)] outline-none"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-display text-[22px] font-semibold">Menú</span>
          <button type="button" onClick={onClose} aria-label="Cerrar menú" className="grid h-11 w-11 place-items-center text-ink-4">
            <CloseIcon />
          </button>
        </div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={onClose}
            aria-current={isActive(n.href) ? "page" : undefined}
            className={`border-b border-[rgba(61,51,48,.08)] px-1 py-[15px] text-base font-semibold ${isActive(n.href) ? "text-blush" : "text-ink"}`}
          >
            {n.label}
          </Link>
        ))}
        <Link href="/admin" onClick={onClose} className="border-b border-[rgba(61,51,48,.08)] px-1 py-3.5 text-sm font-semibold text-ink-4">
          Panel administrativo
        </Link>
        <a
          href={waLink(WA_MSG.general)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="mt-[18px] inline-flex items-center justify-center gap-[9px] rounded-[14px] bg-wa p-[15px] text-[15px] font-bold text-white hover:bg-wa-dark"
        >
          <WhatsAppIcon size={19} />
          Cotizar por WhatsApp
        </a>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

export const starsText = (n: number) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

export function Breadcrumb({ items, className = "mb-2" }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Ruta" className={`text-[13px] font-semibold text-ink-4 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>·</span>}
            {it.href ? (
              <Link href={it.href} className="font-bold text-blush hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageIntro({
  icon,
  iconClass,
  title,
  children,
  className = "mb-[22px]",
}: {
  icon: ReactNode;
  iconClass: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-start gap-3 ${className}`}>
      <div className={`grid h-11 w-11 flex-none place-items-center rounded-[13px] ${iconClass}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <h1 className="mb-1 font-title text-[44px] font-semibold leading-none text-ink mob:text-[36px]">{title}</h1>
        <p className="m-0 max-w-[640px] text-[15px] text-ink-4">{children}</p>
      </div>
    </div>
  );
}

/** Chip de filtro (como enlace, para que el filtro viva en la URL). */
export function chipClass(active: boolean, size: "sm" | "md" = "sm") {
  const pad = size === "sm" ? "px-3 py-1.5 text-[12.5px]" : "px-[17px] py-[9px] text-[13px]";
  return `inline-flex items-center rounded-full border font-semibold transition-colors ${pad} ${
    active ? "border-blush bg-blush text-white" : "border-line-warm bg-chip text-ink-3 hover:border-line-dash"
  }`;
}

export function SectionHead({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3.5">
      <div>
        <div className="pm-eyebrow mb-2.5">{eyebrow}</div>
        <h2 className="pm-h2">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-blush hover:underline">
          {link.label}
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";

// Wordmark tipográfico provisional (no es el logo definitivo de la marca).
export function LogoMark({ size = 40, fontSize = 19 }: { size?: number; fontSize?: number }) {
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-full font-display font-bold text-white shadow-[0_4px_12px_-4px_rgba(201,156,116,.6)]"
      style={{ width: size, height: size, fontSize, background: "linear-gradient(135deg,#E7BFC2,#C99C74)" }}
    >
      pm
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-[11px] rounded-lg" aria-label="Petite Moments Guatemala, inicio">
      <LogoMark />
      <span className="text-left leading-none">
        <span className="block font-display text-[23px] font-semibold tracking-[.01em] text-ink">Petite Moments</span>
        <span className="mt-[3px] block text-[9.5px] font-bold tracking-[.32em] text-champagne">GUATEMALA</span>
      </span>
    </Link>
  );
}

"use client";
import { useEffect, useState } from "react";
import { TrashIcon } from "@/components/icons";

export type ActionRes = { ok: true } | { ok: false; error: string };
export type Run = (fn: () => Promise<ActionRes>, okText?: string) => Promise<boolean>;

export const btn = {
  primary: "rounded-[11px] bg-blush font-bold text-white transition-colors hover:bg-blush-dark disabled:opacity-60",
  soft: "rounded-[9px] border border-line-warm bg-warm font-bold text-mocha transition-colors hover:bg-warm-hover disabled:opacity-60",
  white: "rounded-[11px] border border-line-input bg-white font-bold text-mocha transition-colors hover:bg-warm",
  danger: "rounded-[9px] border border-danger-line bg-danger-bg font-bold text-danger-text transition-colors hover:bg-danger-hover disabled:opacity-60",
};

export const adminH2 = "font-display text-2xl font-semibold";

/** Botón de eliminar con confirmación en dos clics (sin diálogos del navegador). */
export function DeleteButton({
  onConfirm,
  label = "Eliminar",
  size = 34,
  iconSize = 16,
  disabled,
  text,
}: {
  onConfirm: () => void;
  label?: string;
  size?: number;
  iconSize?: number;
  disabled?: boolean;
  text?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3500);
    return () => clearTimeout(t);
  }, [armed]);

  if (armed || text) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
        className={`${btn.danger} flex-none whitespace-nowrap px-3 text-[12.5px]`}
        style={{ height: text && !armed ? undefined : size, paddingBlock: text && !armed ? 9 : undefined }}
      >
        {armed ? "¿Confirmar?" : text}
      </button>
    );
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setArmed(true)}
      aria-label={label}
      title={label}
      className={`${btn.danger} grid flex-none place-items-center`}
      style={{ width: size, height: size, borderRadius: size < 30 ? 8 : 9 }}
    >
      <TrashIcon size={iconSize} />
    </button>
  );
}

export function Chip({ active, onClick, children, small }: { active: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border font-semibold transition-colors ${small ? "px-[11px] py-[5px] text-[11.5px]" : "px-3 py-1.5 text-[12.5px]"} ${
        active ? "border-blush bg-blush text-white" : "border-line-warm bg-chip text-ink-3 hover:border-line-dash"
      }`}
    >
      {children}
    </button>
  );
}

export function AdminField({ label, children, req, className = "" }: { label: string; children: React.ReactNode; req?: boolean; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[12.5px] font-bold text-ink-2">
        {label}
        {req && <span className="text-blush"> *</span>}
      </span>
      {children}
    </label>
  );
}

export const starsText = (n: number) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

const fmt = new Intl.DateTimeFormat("es-GT", { timeZone: "America/Guatemala", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const fmtDateTime = (iso: string) => (iso ? fmt.format(new Date(iso)) : "");

const fmtDay = new Intl.DateTimeFormat("es-GT", { timeZone: "UTC", weekday: "short", day: "2-digit", month: "short", year: "numeric" });
export const fmtEventDate = (d: string | null) => (d ? fmtDay.format(new Date(`${d}T00:00:00Z`)) : "Fecha por definir");

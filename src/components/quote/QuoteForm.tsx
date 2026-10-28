"use client";
import Link from "next/link";
import { Suspense, use, useRef, useState, useTransition } from "react";
import { submitLead } from "@/app/actions";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { chipClass } from "@/components/ui";
import { track } from "@/lib/analytics";
import { QUOTE_OPTIONS, SITE } from "@/lib/config";
import { buildQuoteMessage, mailtoLink, type QuoteFormData, WA_MSG, waLink } from "@/lib/whatsapp";

const EMPTY: QuoteFormData = {
  nombre: "",
  whatsapp: "",
  correo: "",
  fecha: "",
  hora: "",
  tipo: "Cumpleaños infantil",
  invitados: "",
  zona: "",
  lugar: "Casa",
  servicio: "Decoración",
  estilo: "Elegante",
  presupuesto: "Prefiero que me orienten",
  comentarios: "",
  contacto: "WhatsApp",
};

const Req = () => <span className="text-blush" aria-hidden> *</span>;

export function QuoteForm({ productPromise }: { productPromise: Promise<string | null> }) {
  const [f, setF] = useState<QuoteFormData>(EMPTY);
  const [sent, setSent] = useState<QuoteFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const honeypot = useRef<HTMLInputElement>(null);

  const set = (k: keyof QuoteFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!f.nombre.trim()) return setError("Escribe tu nombre completo.");
    if (f.whatsapp.replace(/\D/g, "").length < 8) return setError("Escribe un número de WhatsApp válido (8 dígitos).");
    start(async () => {
      const producto = (await productPromise) ?? undefined;
      const res = await submitLead({ ...f, producto, website: honeypot.current?.value });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      track.lead({ tipo: f.tipo, servicio: f.servicio, presupuesto: f.presupuesto, producto });
      setSent({ ...f, producto });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (sent) {
    const msg = buildQuoteMessage(sent);
    return (
      <div className="mx-auto my-5 max-w-[620px] animate-[pmZoom_.4s_ease] rounded-3xl border border-line bg-white px-10 py-11 text-center shadow-[0_20px_44px_-24px_rgba(109,74,82,.3)] mob:px-6">
        <div className="mx-auto mb-[22px] grid h-[72px] w-[72px] place-items-center rounded-full bg-ok-bg text-wa">
          <CheckIcon size={36} />
        </div>
        <h1 className="mb-3 font-title text-[34px] font-semibold">¡Recibimos tu solicitud!</h1>
        <p className="mb-7 text-[15.5px] leading-[1.6] text-ink-3">
          Guardamos los datos de tu evento. Para agilizar tu cotización, continúa por WhatsApp: ya preparamos el mensaje con toda tu información.
        </p>
        <div className="flex flex-col gap-[11px]">
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-[15px] bg-wa p-4 text-base font-extrabold text-white hover:bg-wa-dark"
          >
            <WhatsAppIcon size={21} />
            Continuar por WhatsApp
          </a>
          <a
            href={mailtoLink(`Solicitud de cotización — ${sent.tipo || "evento"}`, msg)}
            className="rounded-[13px] border border-line-warm bg-warm p-3.5 text-[14.5px] font-bold text-mocha hover:bg-warm-hover"
          >
            Enviar por correo
          </a>
          <Link href="/" className="p-2 text-sm font-bold text-ink-4 hover:text-ink-2">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_320px] items-start gap-[34px] tab:grid-cols-1">
      <form onSubmit={onSubmit} noValidate>
        <h1 className="mb-1.5 font-title text-[44px] font-semibold text-ink mob:text-[36px]">Solicita tu cotización</h1>
        <p className="mb-[26px] text-[15px] text-ink-4">
          Cuéntanos qué celebras y te ayudamos a crear una propuesta a tu medida. Los campos con <span className="text-blush">*</span> son los esenciales.
        </p>
        <Suspense fallback={null}>
          <ProductChip promise={productPromise} />
        </Suspense>
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-4 mob:grid-cols-1">
          <Field label="Nombre completo" req>
            <input value={f.nombre} onChange={set("nombre")} placeholder="Tu nombre" autoComplete="name" required maxLength={100} className="pm-input" />
          </Field>
          <Field label="WhatsApp" req>
            <input value={f.whatsapp} onChange={set("whatsapp")} placeholder="+502 ...." inputMode="tel" autoComplete="tel" required maxLength={30} className="pm-input" />
          </Field>
          <Field label="Correo electrónico">
            <input value={f.correo} onChange={set("correo")} type="email" placeholder="tucorreo@ejemplo.com" autoComplete="email" maxLength={120} className="pm-input" />
          </Field>
          <Field label="Fecha del evento">
            <input value={f.fecha} onChange={set("fecha")} type="date" className="pm-input py-[11px]" />
          </Field>
          <Field label="Hora aproximada">
            <input value={f.hora} onChange={set("hora")} type="time" className="pm-input py-[11px]" />
          </Field>
          <Field label="Tipo de evento" req>
            <Select value={f.tipo} onChange={set("tipo")} options={QUOTE_OPTIONS.tipo} />
          </Field>
          <Field label="Cantidad de invitados">
            <input value={f.invitados} onChange={set("invitados")} placeholder="Aprox." inputMode="numeric" maxLength={30} className="pm-input" />
          </Field>
          <Field label="Zona / municipio">
            <input value={f.zona} onChange={set("zona")} placeholder="Ej. Zona 10, Mixco..." maxLength={100} className="pm-input" />
          </Field>
          <Field label="Lugar">
            <Select value={f.lugar} onChange={set("lugar")} options={QUOTE_OPTIONS.lugar} />
          </Field>
          <Field label="Servicio que deseas">
            <Select value={f.servicio} onChange={set("servicio")} options={QUOTE_OPTIONS.servicio} />
          </Field>
          <Field label="Estilo deseado">
            <Select value={f.estilo} onChange={set("estilo")} options={QUOTE_OPTIONS.estilo} />
          </Field>
          <Field label="Presupuesto aproximado">
            <Select value={f.presupuesto} onChange={set("presupuesto")} options={QUOTE_OPTIONS.presupuesto} />
          </Field>
          <Field label="Comentarios adicionales" full>
            <textarea
              value={f.comentarios}
              onChange={set("comentarios")}
              rows={3}
              maxLength={2000}
              placeholder="Temática, colores, referencias que viste en Instagram..."
              className="pm-input resize-y"
            />
          </Field>
        </div>
        <fieldset className="mt-[18px]">
          <legend className="pm-label mb-[9px] block">¿Cómo prefieres que te contactemos?</legend>
          <div className="flex flex-wrap gap-[9px]">
            {QUOTE_OPTIONS.contacto.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={f.contacto === c}
                onClick={() => setF((s) => ({ ...s, contacto: c }))}
                className={`${chipClass(f.contacto === c, "md")} px-[18px]`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-danger-line bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-text">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-[26px] w-full rounded-[15px] bg-blush p-[17px] text-base font-extrabold text-white shadow-[0_12px_26px_-12px_rgba(192,128,140,.6)] transition-colors hover:bg-blush-dark disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar solicitud de cotización"}
        </button>
      </form>

      <aside className="sticky top-24 flex flex-col gap-4 tab:static">
        <div className="rounded-[20px] p-6 text-white" style={{ background: "linear-gradient(150deg,#C0808C,#B08968)" }}>
          <h2 className="mb-2.5 font-display text-2xl font-semibold">¿Prefieres escribir directo?</h2>
          <p className="mb-[18px] text-sm leading-[1.55] text-white/90">Escríbenos por WhatsApp y con gusto te atendemos.</p>
          <a
            href={waLink(WA_MSG.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-[9px] rounded-[13px] bg-white p-3.5 text-[14.5px] font-extrabold text-blush-dark"
          >
            <WhatsAppIcon size={19} className="text-wa" />
            {SITE.whatsappDisplay}
          </a>
        </div>
        <div className="rounded-[20px] border border-line bg-white p-[22px]">
          <h2 className="mb-3 text-sm font-extrabold text-ink">Antes de cotizar, ten a mano</h2>
          <ul className="flex flex-col gap-2.5">
            {["Fecha y hora tentativa", "Zona o municipio del evento", "Imágenes de referencia (Instagram, Pinterest)", "Colores o temática que te gusten"].map((t) => (
              <li key={t} className="flex gap-[9px] text-[13.5px] leading-[1.45] text-ink-3">
                <span className="font-extrabold text-blush" aria-hidden>·</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function ProductChip({ promise }: { promise: Promise<string | null> }) {
  const name = use(promise);
  if (!name) return null;
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-warm bg-warm2 px-4 py-2 text-[13px] font-semibold text-[#8A5A5F]">
      Producto de interés: <strong>{name}</strong>
    </div>
  );
}

function Field({ label, req, full, children }: { label: string; req?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-[7px] ${full ? "col-span-full" : ""}`}>
      <span className="pm-label">
        {label}
        {req && <Req />}
      </span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: React.ChangeEventHandler<HTMLSelectElement>; options: readonly string[] }) {
  return (
    <select value={value} onChange={onChange} className="pm-input">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

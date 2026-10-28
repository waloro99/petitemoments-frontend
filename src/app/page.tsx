import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BalloonsIcon,
  CakeIcon,
  CheckCircleIcon,
  DollarIcon,
  GiftIcon,
  CraftIcon,
  BallIcon,
  PackageIcon,
  PinIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { isPlaceholder, Media } from "@/components/Media";
import { occLabel, SITE } from "@/lib/config";
import { getPublicCatalog } from "@/lib/data";
import { absUrl } from "@/lib/seo";
import { WA_MSG, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { absolute: "Petite Moments GT · Decoración con globos, sorpresas y eventos en Guatemala" },
  description:
    "Globos, cake toppers, sorpresas, centros de mesa, juegos y detalles personalizados para cumpleaños, baby showers, graduaciones y todo tipo de celebraciones en Ciudad de Guatemala. Cotiza por WhatsApp.",
  alternates: { canonical: "/" },
};

const CATEGORY_CARDS: { href: string; title: string; text: string; icon: ReactNode; tint: string; color: string }[] = [
  { href: "/catalogo?categoria=globos", title: "Decoración con globos", text: "Arcos orgánicos, backdrops, números, columnas y paredes decorativas.", icon: <BalloonsIcon />, tint: "#F7E7E3", color: "#C0808C" },
  { href: "/catalogo?categoria=sorpresas", title: "Sorpresas personalizadas", text: "Cajas, bolsas, globos con mensaje y detalles para fechas especiales.", icon: <GiftIcon />, tint: "#F1E8DA", color: "#B08968" },
  { href: "/catalogo?categoria=cake-toppers", title: "Cake toppers", text: "Toppers personalizados con nombres, edades y temáticas para darle el toque final a tu pastel.", icon: <CakeIcon />, tint: "#F0E9E1", color: "#B58A6E" },
  { href: "/catalogo?categoria=personalizables", title: "Personalizables para eventos", text: "Centros de mesa, vinil para globos, juegos de gender reveal, pizarrones, crafting y más, hechos a tu estilo.", icon: <CraftIcon />, tint: "#EDE9E0", color: "#9A8A72" },
  { href: "/catalogo?categoria=juegos", title: "Juegos para eventos", text: "Hockey de mesa, fútbol, básquet y más juegos para que grandes y chicos se diviertan en tu celebración.", icon: <BallIcon />, tint: "#EAEAE0", color: "#8FA07E" },
];

const GUIDE = [
  { emoji: "🎈", label: "Quiero decorar un cumpleaños", href: "/catalogo?categoria=globos" },
  { emoji: "🎁", label: "Quiero enviar una sorpresa", href: "/catalogo?categoria=sorpresas" },
  { emoji: "🧸", label: "Quiero algo para niños", href: "/catalogo?ocasion=infantil" },
  { emoji: "🥂", label: "Quiero algo elegante para adultos", href: "/catalogo?estilo=elegante" },
  { emoji: "✨", label: "Quiero cotizar un paquete completo", href: "/catalogo?categoria=paquetes" },
];

const STEPS = [
  ["Eliges el tipo de evento", "Cumpleaños, baby shower, aniversario, corporativo o una sorpresa."],
  ["Nos cuentas los detalles", "Fecha, lugar, estilo y presupuesto por WhatsApp o el formulario."],
  ["Te enviamos una propuesta", "Una cotización a tu medida con opciones para tu presupuesto."],
  ["Coordinamos montaje o entrega", "Llegamos, montamos y dejamos todo listo para celebrar."],
];

const TRUST: [ReactNode, string, string][] = [
  [<CheckCircleIcon key="a" />, "Trabajos reales", "Todo lo que ves lo hemos montado nosotros."],
  [<UserIcon key="b" />, "Atención personalizada", "Te acompañamos desde la idea hasta el montaje."],
  [<DollarIcon key="c" />, "Opciones para cada presupuesto", "Desde una sorpresa pequeña hasta un montaje completo."],
  [<PinIcon key="d" />, "Servicio en Ciudad de Guatemala", "Cobertura en la ciudad y municipios cercanos."],
];

const SPANS = ["row-span-2", "row-span-1", "row-span-1", "row-span-1", "row-span-2", "row-span-1"];

const cardHover =
  "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_34px_-18px_rgba(109,74,82,.32)]";

export default async function HomePage() {
  const catalog = await getPublicCatalog();
  const works = catalog.gallery.slice(0, 6);
  const heroImg = catalog.gallery.find((g) => !isPlaceholder(g.img));

  return (
    <main>
      {/* HERO */}
      <section className="pm-container grid max-w-[1240px] grid-cols-[1.05fr_.95fr] items-center gap-14 pb-10 pt-14 tab:grid-cols-1 tab:gap-9">
        <div className="animate-pm-rise">
          <div className="mb-[22px] inline-flex items-center gap-[9px] text-[11.5px] font-bold uppercase tracking-[.22em] text-champagne">
            <span className="h-px w-[26px] bg-gold" aria-hidden />
            Detalles que se celebran · Ciudad de Guatemala
          </div>
          <h1 className="mb-5 font-display text-[60px] font-semibold leading-[1.04] tracking-[-.01em] text-ink tab:text-[46px] mob:text-[36px]">
            Decoración, sorpresas y detalles para celebrar <em className="italic text-blush">momentos especiales</em>.
          </h1>
          <p className="mb-8 max-w-[520px] text-lg leading-[1.6] text-ink-3 mob:text-base">
            Globos, cake toppers, sorpresas, centros de mesa, juegos y detalles personalizados para cumpleaños, baby showers, graduaciones y todo tipo de celebraciones.
          </p>
          <div className="flex flex-wrap gap-[13px]">
            <a
              href={waLink(WA_MSG.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[9px] rounded-full bg-wa px-[26px] py-4 text-[15.5px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(37,211,102,.55)] transition hover:-translate-y-px hover:bg-wa-dark"
            >
              <WhatsAppIcon size={19} />
              ¡Reserva tu evento!
            </a>
            <Link
              href="/catalogo"
              className="rounded-full border border-line-input bg-white px-[26px] py-4 text-[15.5px] font-bold text-ink-2 transition-colors hover:border-line-dash hover:bg-warm"
            >
              Ver catálogo
            </Link>
            <Link
              href="/galeria"
              className="rounded-full px-2.5 py-4 text-[15.5px] font-bold text-[#8A6A5E] underline decoration-[#DCC3B4] underline-offset-[5px]"
            >
              Ver trabajos realizados
            </Link>
          </div>
          <dl className="mt-[38px] flex gap-[30px] mob:gap-4 border-t border-[rgba(61,51,48,.1)] pt-[26px]">
            {[
              ["+400", "celebraciones montadas"],
              ["6", "líneas de servicio"],
              ["24 h", "respuesta por WhatsApp"],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col-reverse">
                <dt className="text-[12.5px] font-semibold text-ink-4">{l}</dt>
                <dd className="m-0 font-display text-[30px] font-semibold text-blush">{n}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-pm-rise-slow">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[26px] shadow-[0_30px_60px_-30px_rgba(109,74,82,.4)]"
            style={{ background: "linear-gradient(150deg,#F3DBD9 0%,#EAD3BE 55%,#E7C7CB 100%)" }}
          >
            {heroImg ? (
              <Media src={heroImg.img} alt={`${heroImg.title} – decoración de eventos en Guatemala`} sizes="(max-width:1000px) 100vw, 560px" priority />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[rgba(138,90,95,.55)]">
                <BalloonsIcon size={66} strokeWidth={1.2} />
              </div>
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,.5),transparent_45%)]" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-[18px] text-[#8A5A5F]">
              <span className="rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em]">
                {heroImg ? heroImg.title : "Montaje destacado"}
              </span>
            </div>
          </div>
          <div
            className="absolute -bottom-[26px] -left-[30px] grid aspect-square w-[150px] place-items-center overflow-hidden rounded-[20px] border-[5px] border-ivory text-[rgba(138,90,95,.5)] shadow-[0_20px_40px_-18px_rgba(109,74,82,.4)] tab:left-0 mob:hidden"
            style={{ background: "linear-gradient(150deg,#EFE0C9,#E8C6C9)" }}
            aria-hidden
          >
            <GiftIcon size={34} strokeWidth={1.3} />
          </div>
          <div className="absolute -right-[22px] top-[22px] flex items-center gap-2.5 rounded-2xl bg-white px-4 py-[13px] shadow-[0_16px_34px_-16px_rgba(109,74,82,.35)] tab:right-3">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#F3DBD9] text-[17px] text-blush" aria-hidden>✦</span>
            <span className="text-[12.5px] font-bold leading-[1.3] text-ink-2">
              Personalizado
              <br />
              <span className="font-medium text-ink-4">colores · temática · nombre</span>
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="pm-container max-w-[1240px] pb-5 pt-[52px]" aria-labelledby="h-cat">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3.5">
          <div>
            <div className="pm-eyebrow mb-2.5">Qué hacemos</div>
            <h2 id="h-cat" className="pm-h2">Explora por tipo de servicio</h2>
          </div>
          <Link href="/catalogo" className="text-[14.5px] font-bold text-blush hover:underline">Ver todo el catálogo →</Link>
        </div>
        <div className="grid grid-cols-3 gap-[18px] tab:grid-cols-2 mob:grid-cols-1">
          {CATEGORY_CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`rounded-[20px] border border-line bg-white p-[26px] text-left shadow-[0_6px_22px_-14px_rgba(109,74,82,.25)] ${cardHover}`}
            >
              <span className="mb-[18px] grid h-[52px] w-[52px] place-items-center rounded-[15px]" style={{ background: c.tint, color: c.color }}>
                {c.icon}
              </span>
              <h3 className="mb-[7px] font-display text-2xl font-semibold">{c.title}</h3>
              <p className="m-0 text-sm leading-[1.55] text-ink-4">{c.text}</p>
            </Link>
          ))}
          <Link
            href="/catalogo?categoria=paquetes"
            className="rounded-[20px] p-[26px] text-left shadow-[0_10px_26px_-14px_rgba(192,128,140,.6)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_20px_38px_-18px_rgba(192,128,140,.55)]"
            style={{ background: "linear-gradient(150deg,#C0808C,#B08968)" }}
          >
            <span className="mb-[18px] grid h-[52px] w-[52px] place-items-center rounded-[15px] bg-white/22 text-white">
              <PackageIcon />
            </span>
            <h3 className="mb-[7px] font-display text-2xl font-semibold text-white">Paquetes para eventos</h3>
            <p className="m-0 text-sm leading-[1.55] text-white/85">Decoración + cake topper + personalizables + juegos, listos para cotizar.</p>
          </Link>
        </div>
      </section>

      {/* GUÍA */}
      <section className="mt-14 bg-tint" aria-labelledby="h-guia">
        <div className="pm-container max-w-[1240px] py-14">
          <div className="mb-[34px] text-center">
            <div className="pm-eyebrow mb-[11px]">¿No sabes por dónde empezar?</div>
            <h2 id="h-guia" className="pm-h2 mx-auto max-w-[640px]">Cuéntanos qué celebras y te llevamos a la opción indicada</h2>
          </div>
          <div className="grid grid-cols-5 gap-3.5 tab:grid-cols-2 mob:grid-cols-1">
            {GUIDE.map((g) => (
              <Link
                key={g.label}
                href={g.href}
                className="rounded-[18px] border border-line-warm bg-white px-[18px] py-[22px] text-center transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-3 text-[26px]" aria-hidden>{g.emoji}</div>
                <div className="text-[14.5px] font-bold leading-[1.35] text-ink-2">{g.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRABAJOS DESTACADOS */}
      {works.length > 0 && (
        <section className="pm-container max-w-[1240px] pb-5 pt-[60px]" aria-labelledby="h-works">
          <div className="mb-[26px] flex flex-wrap items-end justify-between gap-3.5">
            <div>
              <div className="pm-eyebrow mb-2.5">Trabajos realizados</div>
              <h2 id="h-works" className="pm-h2">Inspiración para tu próxima celebración</h2>
            </div>
            <Link href="/galeria" className="text-[14.5px] font-bold text-blush hover:underline">Ver galería completa →</Link>
          </div>
          <div className="grid auto-rows-[190px] grid-cols-4 gap-3.5 tab:grid-cols-2 mob:grid-cols-1">
            {works.map((w, i) => (
              <Link
                key={w.id}
                href={`/galeria?ocasion=${w.occ}`}
                className={`relative overflow-hidden rounded-2xl transition-transform duration-[250ms] hover:scale-[1.015] ${SPANS[i % SPANS.length]}`}
              >
                <Media src={w.img} alt={`${w.title} – ${occLabel(w.occ)}`} sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 300px" />
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_65%_30%,rgba(255,255,255,.32),transparent_55%)]" />
                <span className="absolute bottom-[11px] left-3 rounded-full bg-white/85 px-[11px] py-[5px] text-[10.5px] font-bold tracking-[.06em] text-[#7A4A50]">
                  {occLabel(w.occ)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PROCESO */}
      <section className="pm-container max-w-[1240px] pb-5 pt-[60px]" aria-labelledby="h-proc">
        <div className="mb-9 text-center">
          <div className="pm-eyebrow mb-[11px]">Cómo trabajamos</div>
          <h2 id="h-proc" className="pm-h2">De la idea al montaje, en cuatro pasos</h2>
        </div>
        <ol className="grid grid-cols-4 gap-5 tab:grid-cols-2 mob:grid-cols-1">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border-[1.5px] border-line-warm bg-white font-display text-2xl font-semibold text-blush">
                {i + 1}
              </div>
              <h3 className="mb-[7px] text-base font-bold text-ink">{t}</h3>
              <p className="m-0 text-[13.5px] leading-[1.55] text-ink-4">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CONFIANZA */}
      <section className="pm-container max-w-[1240px] py-11" aria-label="Por qué elegirnos">
        <div className="grid grid-cols-4 gap-4 tab:grid-cols-2 mob:grid-cols-1">
          {TRUST.map(([icon, t, d]) => (
            <div key={t} className="rounded-[18px] border border-line bg-white p-[22px]">
              <div className="mb-3 text-blush">{icon}</div>
              <h3 className="mb-[5px] text-[15px] font-bold">{t}</h3>
              <p className="m-0 text-[13px] leading-normal text-ink-4">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pm-container mt-[34px] max-w-[1240px]">
        <div
          className="relative overflow-hidden rounded-[28px] px-10 py-[58px] text-center mob:px-6"
          style={{ background: "linear-gradient(140deg,#C0808C 0%,#B08968 100%)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 20%,rgba(255,255,255,.16),transparent 40%),radial-gradient(circle at 85% 80%,rgba(255,255,255,.12),transparent 40%)",
            }}
          />
          <div className="relative">
            <h2 className="mx-auto mb-3.5 max-w-[620px] font-display text-[42px] font-semibold leading-[1.1] text-white mob:text-[30px]">
              Cuéntanos qué quieres celebrar y te ayudamos a armar la mejor opción
            </h2>
            <p className="mx-auto mb-[30px] max-w-[520px] text-[16.5px] text-white/90">
              Respondemos por WhatsApp y armamos una propuesta a tu medida.
            </p>
            <div className="flex flex-wrap justify-center gap-[13px]">
              <Link href="/cotizar" className="rounded-full bg-white px-[30px] py-4 text-[15.5px] font-bold text-blush-dark transition-transform hover:-translate-y-px">
                Solicitar cotización
              </Link>
              <a
                href={waLink(WA_MSG.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/50 bg-white/16 px-[30px] py-4 text-[15.5px] font-bold text-white transition-colors hover:bg-white/26"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Servicios de Petite Moments GT",
          itemListElement: [...CATEGORY_CARDS.map((c) => ({ t: c.title, d: c.text, h: c.href })), { t: "Paquetes para eventos", d: "Decoración, cake topper, personalizables y juegos en un solo paquete.", h: "/catalogo?categoria=paquetes" }].map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.t,
              description: s.d,
              url: absUrl(s.h),
              areaServed: { "@type": "City", name: SITE.city },
              provider: { "@id": `${SITE.url}/#negocio` },
            },
          })),
        }}
      />
    </main>
  );
}


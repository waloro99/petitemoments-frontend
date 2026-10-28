import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo ${SITE.name} usa los datos que compartes al cotizar y las cookies de medición del sitio.`,
  alternates: { canonical: "/privacidad" },
};

const h2 = "mb-2.5 mt-8 font-display text-[24px] font-semibold text-ink";
const p = "mb-3 text-[15.5px] leading-[1.7] text-ink-3";

export default function PrivacyPage() {
  return (
    <main className="pm-container max-w-[820px] pb-10 pt-[34px]">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Privacidad" }]} />
      <h1 className="mb-4 mt-4 font-title text-[42px] font-semibold leading-[1.1] text-ink mob:text-[34px]">Política de privacidad</h1>
      <p className={p}>
        En {SITE.name} cuidamos los datos que nos compartes. Esta página explica qué información recopilamos, para qué la usamos y cómo
        puedes pedirnos que la borremos.
      </p>

      <h2 className={h2}>Datos que nos das</h2>
      <p className={p}>
        Cuando llenas el formulario de cotización o dejas una reseña guardamos tu nombre, número de WhatsApp, correo (si lo escribes),
        los detalles del evento y tus comentarios. Los usamos solo para responderte, preparar tu cotización y dar seguimiento a tu
        pedido. No los vendemos ni los compartimos con terceros para fines publicitarios.
      </p>

      <h2 className={h2}>Cookies y medición</h2>
      <p className={p}>
        Usamos Google Analytics y el Píxel de Meta (Facebook e Instagram) para saber cuántas personas visitan el sitio, qué páginas
        consultan y cuántas nos contactan. Estas herramientas usan cookies y datos técnicos como el tipo de dispositivo y la página
        visitada. Puedes bloquearlas desde la configuración de tu navegador o desde{" "}
        <a className="font-bold text-blush underline" href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          el complemento de inhabilitación de Google Analytics
        </a>
        .
      </p>

      <h2 className={h2}>Conversaciones por WhatsApp y correo</h2>
      <p className={p}>
        Si nos escribes por WhatsApp o correo, la conversación se rige también por las políticas de esos servicios. Solo usamos esa
        información para atender tu solicitud.
      </p>

      <h2 className={h2}>Tus derechos</h2>
      <p className={p}>
        Puedes pedir que corrijamos o eliminemos tus datos en cualquier momento escribiendo a{" "}
        <a className="font-bold text-blush underline" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>{" "}
        o por WhatsApp al {SITE.whatsappDisplay}.
      </p>

      <p className="mt-10 text-[13px] text-ink-5">
        Última actualización: octubre de 2026 · <Link href="/" className="underline">Volver al inicio</Link>
      </p>
    </main>
  );
}

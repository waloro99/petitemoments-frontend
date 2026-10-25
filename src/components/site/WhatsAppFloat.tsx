"use client";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { WA_MSG, waLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const pathname = usePathname();
  // En el detalle de producto (móvil) ya hay un CTA fijo de WhatsApp; evitamos que se encimen.
  const hideOnMobile = pathname.startsWith("/producto/");
  return (
    <a
      href={waLink(WA_MSG.floating)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 grid h-[58px] w-[58px] animate-pm-float place-items-center rounded-full bg-wa text-white shadow-[0_12px_28px_-8px_rgba(37,211,102,.65)] transition-colors hover:bg-wa-dark ${hideOnMobile ? "mob:hidden" : ""}`}
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}

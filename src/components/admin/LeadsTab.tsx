"use client";
import { useState } from "react";
import { deleteLead, setLeadStatus } from "@/app/admin/actions";
import { MailIcon, WhatsAppIcon } from "@/components/icons";
import type { Lead } from "@/lib/types";
import { toWaPhone, waLink } from "@/lib/whatsapp";
import { adminH2, Chip, DeleteButton, fmtDateTime, fmtEventDate, type Run } from "./shared";

const STATUS: { key: Lead["status"]; label: string }[] = [
  { key: "nuevo", label: "Nuevo" },
  { key: "contactado", label: "Contactado" },
  { key: "cerrado", label: "Cerrado" },
];

const statusStyle: Record<Lead["status"], string> = {
  nuevo: "bg-rose-soft text-blush-dark",
  contactado: "bg-wait-bg text-wait-text",
  cerrado: "bg-ok-bg text-ok-text",
};

export function LeadsTab({ leads, run, readOnly }: { leads: Lead[]; run: Run; readOnly?: boolean }) {
  const [filter, setFilter] = useState<Lead["status"] | "todos">("todos");
  const [open, setOpen] = useState<string | null>(null);
  const list = leads.filter((l) => filter === "todos" || l.status === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={`${adminH2} mb-1`}>Solicitudes de cotización ({leads.length})</h2>
          <p className="text-sm text-ink-4">Cada envío del formulario de cotizar llega aquí y al correo del negocio. Responde en un clic por WhatsApp.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={filter === "todos"} onClick={() => setFilter("todos")}>Todas</Chip>
          {STATUS.map((s) => (
            <Chip key={s.key} active={filter === s.key} onClick={() => setFilter(s.key)}>
              {s.label} ({leads.filter((l) => l.status === s.key).length})
            </Chip>
          ))}
        </div>
      </div>

      {list.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-[#E0CBBB] bg-warm p-[26px] text-center text-[13.5px] text-[#9A8272]">
          {readOnly ? "En modo demo no se guardan solicitudes. Conecta Supabase para recibirlas aquí." : "No hay solicitudes en esta vista."}
        </div>
      )}

      <ul className="flex flex-col gap-2.5">
        {list.map((l) => {
          const greeting = `Hola ${l.nombre.split(" ")[0]}, te escribimos de Petite Moments por tu solicitud de cotización (${l.tipo}${l.fecha ? `, ${l.fecha}` : ""}).`;
          const isOpen = open === l.id;
          return (
            <li key={l.id} className="rounded-[14px] border border-line bg-white px-[18px] py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button type="button" onClick={() => setOpen(isOpen ? null : l.id)} className="min-w-0 flex-1 text-left" aria-expanded={isOpen}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-extrabold text-ink">{l.nombre}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[.06em] ${statusStyle[l.status]}`}>{l.status}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] text-ink-3">
                    {l.tipo} · {fmtEventDate(l.fecha)}
                    {l.hora ? ` · ${l.hora.slice(0, 5)}` : ""}
                    {l.zona ? ` · ${l.zona}` : ""}
                  </div>
                  <div className="text-[11px] text-ink-5">Recibida {fmtDateTime(l.createdAt)} · {isOpen ? "Ocultar detalle" : "Ver detalle"}</div>
                </button>
                <div className="flex flex-none items-center gap-2">
                  <a
                    href={waLink(greeting, toWaPhone(l.whatsapp))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[9px] bg-wa px-3 py-2 text-[12.5px] font-bold text-white hover:bg-wa-dark"
                  >
                    <WhatsAppIcon size={15} />
                    Responder
                  </a>
                  {l.correo && (
                    <a href={`mailto:${l.correo}?subject=${encodeURIComponent(`Tu cotización con Petite Moments`)}`} aria-label={`Escribir a ${l.correo}`} className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-line-warm bg-warm text-mocha">
                      <MailIcon size={16} />
                    </a>
                  )}
                  <DeleteButton label="Eliminar solicitud" disabled={readOnly} onConfirm={() => void run(() => deleteLead(l.id), "Solicitud eliminada.")} />
                </div>
              </div>
              {isOpen && (
                <div className="mt-3 border-t border-line pt-3">
                  <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-[13px] tab:grid-cols-2 mob:grid-cols-1">
                    {[
                      ["WhatsApp", l.whatsapp],
                      ["Correo", l.correo],
                      ["Prefiere", l.contacto],
                      ["Servicio", l.servicio],
                      ["Estilo", l.estilo],
                      ["Presupuesto", l.presupuesto],
                      ["Invitados", l.invitados],
                      ["Lugar", l.lugar],
                      ["Producto", l.productSlug],
                    ]
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[11px] font-bold uppercase tracking-[.06em] text-champagne">{k}</dt>
                          <dd className="m-0 text-ink-2">{v}</dd>
                        </div>
                      ))}
                  </dl>
                  {l.comentarios && <p className="mt-3 rounded-[10px] bg-warm px-3 py-2 text-[13px] text-ink-2">{l.comentarios}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-xs font-bold text-ink-4">Marcar como:</span>
                    {STATUS.map((s) => (
                      <Chip key={s.key} small active={l.status === s.key} onClick={() => void run(() => setLeadStatus(l.id, s.key))}>
                        {s.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

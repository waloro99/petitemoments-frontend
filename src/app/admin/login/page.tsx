import type { Metadata } from "next";
import { LockIcon } from "@/components/icons";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="pm-container max-w-[1180px] pb-[60px] pt-9">
      <div className="mx-auto my-10 max-w-[420px] animate-pm-zoom rounded-3xl border border-line bg-white px-[34px] py-[38px] shadow-[0_20px_44px_-24px_rgba(109,74,82,.3)] mob:px-6">
        <div
          className="mb-5 grid h-14 w-14 place-items-center rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg,#E7BFC2,#C99C74)" }}
        >
          <LockIcon />
        </div>
        <h1 className="mb-1.5 font-display text-[30px] font-semibold">Panel administrativo</h1>
        <p className="mb-[22px] text-sm leading-[1.55] text-ink-4">
          Ingresa para administrar productos, categorías, imágenes, reseñas y cotizaciones.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {} as { error?: string });
  return (
    <form action={action} className="flex flex-col">
      <label className="mb-3.5 flex flex-col gap-[7px]">
        <span className="pm-label">Usuario</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="Tu usuario"
          className="pm-input py-[13px] text-[15px]"
        />
      </label>
      <label className="mb-1.5 flex flex-col gap-[7px]">
        <span className="pm-label">Contraseña</span>
        <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="pm-input py-[13px] text-[15px]" />
      </label>
      {state?.error && (
        <div role="alert" className="mb-1.5 mt-0.5 text-[13px] font-semibold text-error">
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3.5 w-full rounded-[13px] bg-blush p-3.5 text-[15px] font-extrabold text-white transition-colors hover:bg-blush-dark disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
      <Link href="/" className="mt-3.5 w-full text-center text-[13px] font-semibold text-ink-4 hover:text-ink-2">
        ← Volver al sitio
      </Link>
    </form>
  );
}

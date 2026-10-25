import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pm-container max-w-[620px] py-24 text-center">
      <div className="pm-eyebrow mb-3">Error 404</div>
      <h1 className="mb-3 font-display text-[44px] font-semibold">No encontramos esta página</h1>
      <p className="mb-8 text-ink-4">Puede que el producto ya no esté disponible. Explora el catálogo o escríbenos.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="rounded-full bg-blush px-6 py-3.5 font-bold text-white hover:bg-blush-dark">Ver catálogo</Link>
        <Link href="/" className="rounded-full border border-line-input bg-white px-6 py-3.5 font-bold text-ink-2 hover:bg-warm">Volver al inicio</Link>
      </div>
    </main>
  );
}

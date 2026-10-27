import type { Metadata } from "next"
import { ArticulosDestacados } from "@/components/articulos-destacados"
import { getPropiedadesResumen } from "@/lib/propiedades-resumen"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Artículos | ARKIN",
  description: "Guías inmobiliarias para cada etapa de vida: primera compra, la casa de los 40, nido vacío y más.",
}

export default async function ArticulosPage() {
  const propiedades = await getPropiedadesResumen(24)

  return (
    <main className="arkin-rounded-ui min-h-screen bg-arkin-secondary px-5 pb-24 pt-36 text-arkin-accent sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1344px]">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-arkin-accent" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-accent/60">Revista ARKIN</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.88] tracking-[-0.06em] sm:text-7xl">
          Una casa para cada etapa de tu vida.
        </h1>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-arkin-accent/65">
          Guías honestas para decidir mejor, según el momento que estás viviendo.
        </p>

        <div className="mt-16">
          <ArticulosDestacados propiedades={propiedades} />
        </div>
      </div>
    </main>
  )
}

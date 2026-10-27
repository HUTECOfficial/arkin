"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Clock, X } from "lucide-react"
import { ARTICULOS, propiedadesRelacionadas, type Articulo, type PropiedadResumen } from "@/lib/articulos"
import { PropertyCardSquare } from "@/components/property-card-square"

// Tarjetas de artículos que, al dar clic, despliegan el artículo encima de la página con el fondo difuminado
export function ArticulosDestacados({ propiedades, reveal = false }: { propiedades: PropiedadResumen[]; reveal?: boolean }) {
  const [abierto, setAbierto] = useState<Articulo | null>(null)

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ARTICULOS.map((articulo) => (
          <article data-reveal={reveal || undefined} key={articulo.slug} className="arkin-soft-glass group overflow-hidden rounded-[2.25rem] p-2">
            <button type="button" onClick={() => setAbierto(articulo)} className="block w-full overflow-hidden rounded-[1.8rem] text-left">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={articulo.imagen} alt={articulo.titulo} fill className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 33vw" />
                <span className="absolute left-5 top-5 rounded-full bg-arkin-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                  {articulo.categoria}
                </span>
              </div>
              <div className="bg-arkin-secondary/80 p-6 backdrop-blur-xl sm:p-7">
                <h3 className="text-xl font-bold uppercase leading-tight tracking-[-0.025em]">{articulo.titulo}</h3>
                <p className="mt-3 text-sm text-arkin-accent/60">{articulo.extracto}</p>
                <div className="mt-6 flex items-center justify-between border-t border-arkin-accent/10 pt-5 text-xs text-arkin-accent/55">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {articulo.lectura} de lectura</span>
                  <span className="flex items-center gap-1 font-bold text-arkin-accent">Leer <ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>

      {abierto && <ArticuloModal articulo={abierto} propiedades={propiedades} onClose={() => setAbierto(null)} />}
    </>
  )
}

function ArticuloModal({ articulo, propiedades, onClose }: { articulo: Articulo; propiedades: PropiedadResumen[]; onClose: () => void }) {
  const cerrarRef = useRef<HTMLButtonElement>(null)
  const relacionadas = propiedadesRelacionadas(articulo, propiedades)

  useEffect(() => {
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    cerrarRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={articulo.titulo}
      onClick={onClose}
      className="fixed inset-0 z-[70] overflow-y-auto bg-arkin-accent/40 px-2 py-4 backdrop-blur-xl animate-in fade-in duration-300 sm:px-6 sm:py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="arkin-rounded-ui relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-arkin-secondary text-arkin-accent shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-6 duration-500 sm:rounded-[3rem]"
      >
        <button
          ref={cerrarRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar artículo"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-arkin-secondary text-arkin-accent transition-colors hover:bg-arkin-primary sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>

        <section className="relative bg-arkin-accent text-white">
          <Image src={articulo.imagen.replace("/web/card/", "/web/full/")} alt={articulo.titulo} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" />
          <div className="absolute inset-0 bg-gradient-to-t from-arkin-accent via-arkin-accent/60 to-arkin-accent/20" />
          <div className="relative flex min-h-[420px] flex-col justify-end px-6 pb-10 pt-24 sm:px-12 sm:pb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-primary">{articulo.categoria}</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl">{articulo.titulo}</h2>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/65">
              <Clock className="h-4 w-4" /> {articulo.lectura} de lectura
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-6 pb-4 pt-12 sm:px-8">
          <p className="text-xl font-light leading-relaxed text-arkin-accent/85">{articulo.intro}</p>

          {articulo.secciones.map((s) => (
            <section key={s.titulo} className="mt-10">
              <h3 className="text-2xl font-bold uppercase tracking-[-0.03em]">{s.titulo}</h3>
              {s.parrafos.map((p) => (
                <p key={p} className="mt-4 leading-relaxed text-arkin-accent/75">{p}</p>
              ))}
              {s.lista && (
                <ul className="mt-5 space-y-3">
                  {s.lista.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-arkin-accent/75">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-arkin-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="mt-12 rounded-[2rem] bg-arkin-primary p-8 sm:p-10">
            <p className="text-lg font-medium leading-relaxed">{articulo.cierre}</p>
            <Link href="/contacto" className="mt-6 inline-flex items-center gap-3 rounded-full bg-arkin-accent px-6 py-4 text-sm font-bold text-white">
              Hablar con un asesor <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {relacionadas.length > 0 && (
          <section className="px-4 pb-8 pt-10 sm:px-8 sm:pb-10">
            <div className="mb-6 flex items-center gap-3 px-2">
              <span className="h-px w-8 bg-arkin-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-accent/60">Propiedades relacionadas</span>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {relacionadas.map((property) => (
                <PropertyCardSquare key={property.id ?? property.title} property={property} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

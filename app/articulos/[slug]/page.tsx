import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from "lucide-react"
import { ARTICULOS, getArticulo, propiedadesRelacionadas } from "@/lib/articulos"
import { getPropiedadesResumen } from "@/lib/propiedades-resumen"
import { PropertyCardSquare } from "@/components/property-card-square"
import { HomepageAdSlot } from "@/components/homepage-ads"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export function generateStaticParams() {
  return ARTICULOS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const articulo = getArticulo((await params).slug)
  if (!articulo) return {}
  return { title: `${articulo.titulo} | ARKIN`, description: articulo.extracto }
}

export default async function ArticuloPage({ params }: PageProps) {
  const articulo = getArticulo((await params).slug)
  if (!articulo) notFound()

  const otros = ARTICULOS.filter((a) => a.slug !== articulo.slug)
  const relacionadas = propiedadesRelacionadas(articulo, await getPropiedadesResumen(24))

  return (
    <main className="arkin-rounded-ui min-h-screen bg-arkin-secondary pb-24 text-arkin-accent">
      <section className="relative m-2 overflow-hidden rounded-[2.5rem] bg-arkin-accent text-white sm:rounded-[3.5rem]">
        <Image src={articulo.imagen.replace("/web/card/", "/web/full/")} alt={articulo.titulo} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-arkin-accent via-arkin-accent/60 to-arkin-accent/20" />
        <div className="relative mx-auto flex min-h-[560px] max-w-4xl flex-col justify-end px-5 pb-14 pt-36 sm:px-8">
          <Link href="/articulos" className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 hover:text-arkin-primary">
            <ArrowLeft className="h-4 w-4" /> Todos los artículos
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-primary">{articulo.categoria}</span>
          <h1 className="mt-4 text-4xl font-bold uppercase leading-[0.92] tracking-[-0.055em] sm:text-6xl">{articulo.titulo}</h1>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/65">
            <Clock className="h-4 w-4" /> {articulo.lectura} de lectura
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
        <p className="text-xl font-light leading-relaxed text-arkin-accent/85">{articulo.intro}</p>

        {articulo.secciones.map((s) => (
          <section key={s.titulo} className="mt-12">
            <h2 className="text-2xl font-bold uppercase tracking-[-0.03em]">{s.titulo}</h2>
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

        <div className="mt-14 rounded-[2rem] bg-arkin-primary p-8 sm:p-10">
          <p className="text-lg font-medium leading-relaxed">{articulo.cierre}</p>
          <Link href="/contacto" className="mt-6 inline-flex items-center gap-3 rounded-full bg-arkin-accent px-6 py-4 text-sm font-bold text-white">
            Hablar con un asesor <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-[1344px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-2xl font-bold uppercase tracking-[-0.03em]">Propiedades relacionadas</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {relacionadas.map((property) => (
            <PropertyCardSquare key={property.id ?? property.title} property={property} />
          ))}
        </div>
      </section>

      <div className="mt-16">
        <HomepageAdSlot ubicacion="entre-secciones" fallback />
      </div>

      <section className="mx-auto mt-10 max-w-[1344px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-2xl font-bold uppercase tracking-[-0.03em]">Sigue leyendo</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {otros.map((a) => (
            <Link key={a.slug} href={`/articulos/${a.slug}`} className="arkin-soft-glass group flex items-center gap-5 rounded-[2rem] p-3">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem]">
                <Image src={a.imagen} alt={a.titulo} fill className="object-cover" sizes="112px" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/50">{a.categoria}</span>
                <p className="mt-1 font-bold uppercase leading-tight">{a.titulo}</p>
              </div>
              <ArrowRight className="mr-3 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

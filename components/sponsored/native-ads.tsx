"use client"

// Formatos de publicidad nativa ARKIN: se ven y se comportan como contenido útil
// (calculadora, guía de zona, "lo que ves en esta casa"), siempre marcados como "Aliado".

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight, MapPin, Plus, X } from "lucide-react"

export interface Sponsor {
  marca: string
  categoria: string
  titulo: string
  texto: string
  cta: string
  enlace?: string
  imagen?: string
}

const money = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })

export function SponsorTag({ marca, dark = false }: { marca: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? "text-white/55" : "text-arkin-accent/45"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-arkin-primary" : "bg-arkin-accent/40"}`} />
      Aliado ARKIN · {marca}
    </span>
  )
}

/** 1 · Tarjeta nativa en listados: misma forma que una propiedad, intercalada cada ~8 resultados */
export function NativeListingCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <article className="arkin-soft-glass group overflow-hidden rounded-[2.25rem] p-2">
      <a href={sponsor.enlace || "#"} target="_blank" rel="sponsored noopener" className="block overflow-hidden rounded-[1.8rem]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {sponsor.imagen && (
            <Image src={sponsor.imagen} alt={sponsor.titulo} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 33vw" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-arkin-accent/80 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <SponsorTag marca={sponsor.marca} dark />
            <h3 className="mt-3 text-2xl font-bold uppercase leading-none tracking-[-0.03em]">{sponsor.titulo}</h3>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 bg-arkin-secondary/80 p-6">
          <p className="text-sm text-arkin-accent/60">{sponsor.texto}</p>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-arkin-accent text-arkin-primary">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </a>
    </article>
  )
}

/** 2 · Calculadora de crédito "presentada por" un banco, dentro de la ficha de la propiedad */
export function FinancingCalculator({ precio, sponsor, tasa }: { precio: number; sponsor: Sponsor; tasa: number }) {
  const [enganche, setEnganche] = useState(20)
  const [plazo, setPlazo] = useState(20)
  const monto = precio * (1 - enganche / 100)
  const r = tasa / 100 / 12
  const n = plazo * 12
  const mensual = (monto * r) / (1 - Math.pow(1 + r, -n))

  return (
    <div className="arkin-soft-glass rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-arkin-accent/55">Calcula tu crédito</p>
        <SponsorTag marca={sponsor.marca} />
      </div>
      <p className="mt-5 text-4xl font-bold tracking-[-0.04em]">
        {money(mensual)}
        <span className="ml-2 text-sm font-medium text-arkin-accent/50">/ mes</span>
      </p>
      <p className="mt-1 text-xs text-arkin-accent/50">Tasa ilustrativa desde {tasa}% anual · Crédito por {money(monto)}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-xs font-bold text-arkin-accent/60">
          Enganche · {enganche}%
          <input type="range" min={10} max={50} step={5} value={enganche} onChange={(e) => setEnganche(+e.target.value)} className="mt-2 w-full accent-arkin-accent" />
        </label>
        <label className="text-xs font-bold text-arkin-accent/60">
          Plazo · {plazo} años
          <input type="range" min={5} max={20} step={5} value={plazo} onChange={(e) => setPlazo(+e.target.value)} className="mt-2 w-full accent-arkin-accent" />
        </label>
      </div>
      <a href={sponsor.enlace || "#"} target="_blank" rel="sponsored noopener" className="mt-6 flex items-center justify-between rounded-full bg-arkin-accent px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-arkin-primary hover:text-arkin-accent">
        {sponsor.cta} <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  )
}

export interface Hotspot {
  x: number // % desde la izquierda
  y: number // % desde arriba
  marca: string
  producto: string
  enlace?: string
}

/** 3 · "Lo que ves en esta casa": puntos sobre la foto que revelan la marca del mobiliario / acabado */
export function ShoppableRoom({ image, alt, hotspots }: { image: string; alt: string; hotspots: Hotspot[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem]">
      <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
      <span className="absolute left-4 top-4 rounded-full bg-arkin-secondary/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-arkin-accent">
        Lo que ves en esta casa
      </span>
      {hotspots.map((h, i) => (
        <div key={i} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
          <button
            type="button"
            aria-label={`${h.producto} por ${h.marca}`}
            onClick={() => setOpen(open === i ? null : i)}
            className="-translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-arkin-accent/60 text-white backdrop-blur transition-transform hover:scale-110"
          >
            {open === i ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
          {open === i && (
            <a href={h.enlace || "#"} target="_blank" rel="sponsored noopener" className="absolute left-1/2 top-6 z-10 w-52 -translate-x-1/2 rounded-2xl bg-arkin-secondary p-4 text-arkin-accent shadow-xl">
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-arkin-accent/45">{h.marca}</span>
              <span className="mt-1 block text-sm font-bold">{h.producto}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold">Ver pieza <ArrowUpRight className="h-3 w-3" /></span>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

/** 4 · Guía de zona patrocinada: contenido editorial sobre vivir en un fraccionamiento */
export function ZoneGuide({ zona, image, sponsor, puntos }: { zona: string; image: string; sponsor: Sponsor; puntos: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-arkin-accent text-white">
      <div className="absolute inset-0">
        <Image src={image} alt={`Vivir en ${zona}`} fill className="object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-arkin-accent via-arkin-accent/80 to-transparent" />
      </div>
      <div className="relative max-w-xl p-8 sm:p-12">
        <SponsorTag marca={sponsor.marca} dark />
        <p className="mt-6 flex items-center gap-2 text-sm text-arkin-primary"><MapPin className="h-4 w-4" /> Guía de zona</p>
        <h3 className="mt-2 text-4xl font-bold uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl">Vivir en {zona}</h3>
        <ul className="mt-6 space-y-2 text-sm text-white/70">
          {puntos.map((p) => <li key={p}>— {p}</li>)}
        </ul>
        <a href={sponsor.enlace || "#"} target="_blank" rel="sponsored noopener" className="mt-8 inline-flex items-center gap-2 rounded-full bg-arkin-primary px-6 py-3 text-sm font-bold text-arkin-accent">
          {sponsor.cta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

/** 5 · Servicios para tu nueva casa: carril de aliados después de agendar visita / en favoritos */
export function ServicesRail({ items }: { items: Sponsor[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <a key={s.marca} href={s.enlace || "#"} target="_blank" rel="sponsored noopener" className="arkin-soft-glass group flex min-h-48 flex-col justify-between rounded-[1.75rem] p-6 transition-transform hover:-translate-y-1">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/45">{s.categoria}</p>
            <p className="mt-3 text-lg font-bold uppercase leading-tight tracking-[-0.02em]">{s.titulo}</p>
            <p className="mt-2 text-xs text-arkin-accent/55">{s.texto}</p>
          </div>
          <span className="mt-6 flex items-center justify-between text-xs font-bold">
            {s.marca}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Ad {
  id: string
  titulo: string
  descripcion: string
  imagen: string
  enlace: string
  texto_boton: string
  ubicacion: string
  estilo: string
  activo: boolean
  estado: string
}

function AdBanner({ ad }: { ad: Ad }) {
  useEffect(() => {
    fetch('/api/anuncios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ad.id, tipo: 'impresion' }) }).catch(() => {})
  }, [ad.id])

  const handleClick = () => {
    fetch('/api/anuncios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ad.id, tipo: 'click' }) }).catch(() => {})
    if (ad.enlace) {
      window.open(ad.enlace, '_blank', 'noopener,noreferrer')
    }
  }

  if (ad.estilo === 'sutil') {
    return (
      <div
        onClick={handleClick}
        className="group cursor-pointer rounded-2xl border border-arkin-accent/10 bg-arkin-secondary/80 p-6 sm:p-8 hover:border-arkin-primary/30 transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {ad.imagen && (
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={ad.imagen}
                alt={ad.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-arkin-accent/40 mb-2">
              Patrocinado
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-arkin-accent mb-2">
              {ad.titulo}
            </h3>
            <p className="text-sm text-arkin-accent/60 mb-4 line-clamp-2">
              {ad.descripcion}
            </p>
            {ad.texto_boton && (
              <Button
                size="sm"
                className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-semibold rounded-xl text-xs px-5"
              >
                {ad.texto_boton}
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (ad.estilo === 'destacado') {
    return (
      <div
        onClick={handleClick}
        className="group cursor-pointer relative rounded-3xl overflow-hidden border-2 border-arkin-primary/20 hover:border-arkin-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-arkin-primary/10"
      >
        {ad.imagen && (
          <div className="absolute inset-0">
            <img
              src={ad.imagen}
              alt={ad.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
        )}
        <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-center min-h-[200px]">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-arkin-primary mb-3">
            Patrocinado
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3 max-w-lg">
            {ad.titulo}
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-5 max-w-md line-clamp-2">
            {ad.descripcion}
          </p>
          {ad.texto_boton && (
            <div>
              <Button className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-bold rounded-2xl px-8 py-3 shadow-lg hover:scale-105 transition-all duration-300">
                {ad.texto_boton}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // estilo === 'elegante' (default)
  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-3xl bg-gradient-to-br from-arkin-accent/5 to-arkin-primary/5 border border-arkin-primary/20 p-6 sm:p-10 hover:border-arkin-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-arkin-primary/5"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {ad.imagen && (
          <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            <img
              src={ad.imagen}
              alt={ad.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-arkin-primary/60 mb-3">
            Patrocinado
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-arkin-accent mb-3">
            {ad.titulo}
          </h3>
          <p className="text-sm text-arkin-accent/60 mb-5 line-clamp-2">
            {ad.descripcion}
          </p>
          {ad.texto_boton && (
            <Button className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-semibold rounded-xl px-6 py-2.5 shadow-md hover:scale-105 transition-all duration-300">
              {ad.texto_boton}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Se muestra cuando no hay anuncios activos, para que el espacio siempre se vea y se pueda vender
function AdSpaceFallback() {
  return (
    <a
      href="/alianza-comercial"
      className="group flex flex-col items-start justify-between gap-6 rounded-[2.25rem] border border-dashed border-arkin-accent/25 bg-arkin-secondary/50 p-7 transition-all duration-300 hover:border-arkin-primary hover:bg-arkin-secondary/80 sm:p-10 md:flex-row md:items-center"
    >
      <div>
        <div className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-arkin-accent/45">
          Espacio publicitario disponible
        </div>
        <h3 className="max-w-2xl text-2xl font-bold uppercase leading-none tracking-[-0.04em] text-arkin-accent sm:text-3xl">
          Tu marca frente a quienes están por mudarse.
        </h3>
        <p className="mt-3 max-w-xl text-sm text-arkin-accent/60">
          Créditos, mudanzas, interiorismo, seguros, muebles: llega a compradores y propietarios en el momento exacto de su decisión.
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-arkin-accent px-6 py-4 text-sm font-bold text-white transition-colors group-hover:bg-arkin-primary group-hover:text-arkin-accent">
        Anúnciate con ARKIN <ArrowRight className="h-4 w-4" />
      </span>
    </a>
  )
}

export function HomepageAdSlot({ ubicacion, fallback = false }: { ubicacion: string; fallback?: boolean }) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/anuncios?ubicacion=${ubicacion}`)
      .then(r => r.json())
      .then(data => setAds(data.anuncios || []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [ubicacion])

  if (ads.length === 0 && !(fallback && loaded)) return null

  return (
    <section className="px-5 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-[1344px] space-y-6">
        {ads.length > 0 ? ads.map((ad) => <AdBanner key={ad.id} ad={ad} />) : <AdSpaceFallback />}
      </div>
    </section>
  )
}

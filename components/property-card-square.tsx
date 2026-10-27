import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Bath, BedDouble, MapPin, Maximize2 } from "lucide-react"
import type { PropiedadResumen } from "@/lib/articulos"

// Tarjeta de propiedad con foto 1:1 (home y propiedades relacionadas en artículos)
export function PropertyCardSquare({ property, reveal = false }: { property: PropiedadResumen; reveal?: boolean }) {
  return (
    <article data-reveal={reveal || undefined} className="arkin-soft-glass group overflow-hidden rounded-[2.25rem] p-2">
      <Link data-tilt href={property.id ? `/propiedades/${property.id}` : "/propiedades"} className="arkin-tilt block overflow-hidden rounded-[1.8rem]">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <span className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] ${property.tone === "dark" ? "bg-arkin-accent text-white" : "bg-arkin-secondary text-arkin-accent"}`}>
              {property.type}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-arkin-secondary text-arkin-accent opacity-0 transition-all group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="bg-arkin-secondary/80 p-6 backdrop-blur-xl sm:p-7">
          <p className="flex items-center gap-2 text-xs text-arkin-accent/55">
            <MapPin className="h-3.5 w-3.5" /> {property.location}
          </p>
          <h3 className="mt-3 text-xl font-bold uppercase tracking-[-0.025em]">{property.title}</h3>
          <div className="mt-6 flex items-end justify-between gap-4 border-t border-arkin-accent/10 pt-5">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-arkin-accent/40">Desde</span>
              <span className="mt-1 block text-lg font-bold">{property.price}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-arkin-accent/60">
              {property.beds > 0 && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {property.beds}</span>}
              {property.baths > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.baths}</span>}
              <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {property.area}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

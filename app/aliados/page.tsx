import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Ban, Check } from "lucide-react"
import {
  FinancingCalculator,
  NativeListingCard,
  ServicesRail,
  ShoppableRoom,
  ZoneGuide,
  type Sponsor,
} from "@/components/sponsored/native-ads"
import { INNOVA, innovaImg } from "@/lib/innova-media"

// Maqueta interna para vender espacios a marcas. No está enlazada en el menú y no se indexa.
export const metadata: Metadata = {
  title: "Aliados ARKIN · Espacios para marcas",
  robots: { index: false, follow: false },
}

const espacios: {
  numero: string
  nombre: string
  donde: string
  porque: string
  marcas: string[]
  venta: string
  demo: React.ReactNode
}[] = [
  {
    numero: "01",
    nombre: "Calculadora de crédito presentada por",
    donde: "Ficha de cada propiedad, junto al precio",
    porque: "Es la pregunta que todos se hacen al ver el precio. El banco aparece justo cuando aporta algo útil, no interrumpe nada.",
    marcas: ["BBVA México", "Banorte", "Santander", "Scotiabank", "HSBC"],
    venta: "Patrocinio exclusivo por categoría (1 banco a la vez) · mensual + costo por lead precalificado",
    demo: (
      <FinancingCalculator
        precio={16900000}
        tasa={10.5}
        sponsor={{ marca: "BBVA México", categoria: "Crédito hipotecario", titulo: "", texto: "", cta: "Precalifícate en 5 minutos" }}
      />
    ),
  },
  {
    numero: "02",
    nombre: "Lo que ves en esta casa",
    donde: "Galería de la ficha y sección editorial de la pantalla inicial",
    porque: "La gente ya hace zoom para ver la cocina o el sofá. Etiquetamos las piezas reales: la marca aparece como respuesta, no como anuncio.",
    marcas: ["Porcelanosa", "Interceramic", "Helvex", "BoConcept", "Natuzzi", "Bosch", "Vibia"],
    venta: "Por pieza etiquetada o por paquete de propiedades · ideal para marcas que ya equiparon el desarrollo",
    demo: (
      <ShoppableRoom
        image={innovaImg(INNOVA.campinaCocina)}
        alt="Cocina de Residencia Campiña"
        hotspots={[
          { x: 60, y: 70, marca: "Helvex", producto: "Monomando de cocina" },
          { x: 42, y: 62, marca: "Porcelanosa", producto: "Cubierta XTONE efecto mármol" },
          { x: 30, y: 51, marca: "Bosch", producto: "Parrilla de inducción" },
          { x: 85, y: 22, marca: "Vibia", producto: "Lámpara colgante" },
          { x: 44, y: 40, marca: "BoConcept", producto: "Sofá modular" },
        ]}
      />
    ),
  },
  {
    numero: "03",
    nombre: "Tarjeta nativa en el catálogo",
    donde: "Listados de venta, renta y exclusivos · 1 cada 8 propiedades",
    porque: "Tiene la misma forma que una propiedad y está claramente marcada como Aliado. Solo aceptamos marcas del mundo de la casa, para que se sienta curado.",
    marcas: ["Porcelanosa", "Interceramic", "Roche Bobois", "Gaia Design", "Lutron"],
    venta: "Costo por mil impresiones o semana fija por posición",
    demo: (
      <div className="mx-auto max-w-sm">
        <NativeListingCard
          sponsor={{
            marca: "Porcelanosa",
            categoria: "Baños y recubrimientos",
            titulo: "Un baño como este, en tu casa",
            texto: "Agenda una visita al showroom en León.",
            cta: "Agendar",
            imagen: innovaImg(INNOVA.jardinBano),
          }}
        />
      </div>
    ),
  },
  {
    numero: "04",
    nombre: "Guía de zona patrocinada",
    donde: "Fichas de propiedades en esa zona y página de desarrollos",
    porque: "Contenido que el comprador sí quiere leer: amenidades, colegios, tiempos de traslado. La marca firma la guía.",
    marcas: ["Club El Bosque", "Colegios privados de la zona", "Restaurantes", "Plazas comerciales"],
    venta: "Patrocinio por zona (El Bosque, La Campiña, El Molino…) · trimestral",
    demo: (
      <ZoneGuide
        zona="El Bosque"
        image={innovaImg(INNOVA.bosqueGolfCiudad)}
        sponsor={{ marca: "Club El Bosque", categoria: "Club", titulo: "", texto: "", cta: "Conocer membresías" }}
        puntos={["Campo de golf y lagos", "Alberca techada semiolímpica", "Canchas de tenis y pádel", "Restaurante y lounge para socios"]}
      />
    ),
  },
  {
    numero: "05",
    nombre: "Todo para tu nueva casa",
    donde: "Después de agendar visita, en Favoritos y en el panel del propietario",
    porque: "Aparece cuando la persona ya decidió moverse: seguro, mudanza, internet, domótica. Es ayuda, no publicidad.",
    marcas: ["GNP Seguros", "AXA", "Totalplay", "Lutron", "Sonos", "Mudanzas locales"],
    venta: "Paquete de servicios por categoría · costo por lead",
    demo: (
      <ServicesRail
        items={
          [
            { marca: "GNP Seguros", categoria: "Seguro de hogar", titulo: "Protege tu casa desde el día uno", texto: "Cotiza en línea con el valor de la propiedad.", cta: "Cotizar" },
            { marca: "Totalplay", categoria: "Internet", titulo: "Fibra lista para tu mudanza", texto: "Instalación prioritaria en tu nueva dirección.", cta: "Ver planes" },
            { marca: "Lutron", categoria: "Domótica", titulo: "Iluminación y cortinas inteligentes", texto: "Asesoría para casas nuevas y remodelaciones.", cta: "Agendar" },
            { marca: "Sonos", categoria: "Audio", titulo: "Sonido en cada espacio", texto: "Sistemas para terraza, sala y jardín.", cta: "Descubrir" },
          ] satisfies Sponsor[]
        }
      />
    ),
  },
]

const reglas = [
  "Siempre marcado como “Aliado ARKIN”, nunca disfrazado de propiedad.",
  "Nada de pop-ups, banners que se muevan, ni anuncios en el hero o en el buscador.",
  "Máximo un aliado visible por pantalla.",
  "Solo marcas complementarias a vivir, construir o equipar una casa.",
  "Exclusividad por categoría: un banco, una marca de baños, una aseguradora a la vez.",
]

export default function AliadosPage() {
  return (
    <main className="arkin-rounded-ui min-h-screen bg-arkin-secondary px-5 py-16 text-arkin-accent sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <p className="rounded-full border border-arkin-accent/15 px-4 py-2 text-xs text-arkin-accent/60">
          Maqueta interna · Las marcas mostradas son ilustrativas y no tienen relación comercial con ARKIN.
        </p>

        <header className="mt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-accent/50">Aliados ARKIN</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold uppercase leading-[0.88] tracking-[-0.06em] sm:text-7xl">
            Marcas que se sienten parte de la casa.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-arkin-accent/65">
            Cinco espacios donde una marca aparece justo cuando es útil para quien está buscando, comprando o equipando su casa.
          </p>
        </header>

        <section className="mt-12 grid gap-3 rounded-[2rem] bg-arkin-accent p-6 text-white sm:p-8 md:grid-cols-[220px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-arkin-primary">Reglas de la casa</p>
          <ul className="space-y-2 text-sm text-white/75">
            {reglas.map((r) => (
              <li key={r} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-arkin-primary" /> {r}</li>
            ))}
          </ul>
        </section>

        <div className="mt-20 space-y-24">
          {espacios.map((e) => (
            <section key={e.numero} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <span className="font-mono text-xs text-arkin-accent/35">{e.numero}</span>
                <h2 className="mt-3 text-3xl font-bold uppercase leading-[0.95] tracking-[-0.04em] sm:text-4xl">{e.nombre}</h2>
                <p className="mt-4 text-sm font-bold">{e.donde}</p>
                <p className="mt-3 text-sm leading-relaxed text-arkin-accent/65">{e.porque}</p>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/45">Marcas afines</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.marcas.map((m) => (
                    <span key={m} className="rounded-full border border-arkin-accent/15 px-3 py-1.5 text-xs">{m}</span>
                  ))}
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/45">Cómo se vende</p>
                <p className="mt-2 text-sm text-arkin-accent/65">{e.venta}</p>
              </div>
              <div>{e.demo}</div>
            </section>
          ))}
        </div>

        <section className="mt-24 rounded-[2rem] border border-arkin-accent/15 p-6 sm:p-8">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-arkin-accent/55">
            <Ban className="h-4 w-4" /> Dónde no vendemos espacio
          </p>
          <p className="mt-3 text-sm text-arkin-accent/65">
            Hero de la pantalla inicial, buscador, formulario de contacto con asesor y la primera foto de cada propiedad. Ahí la experiencia es de la casa.
          </p>
        </section>

        <Link href="/" className="mt-12 inline-flex items-center gap-2 text-sm font-bold">
          Volver al inicio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}

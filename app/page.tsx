import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  Home,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { AIAgent } from "@/components/ai-agent"
import { HomepageAdSlot } from "@/components/homepage-ads"
import { ArticulosDestacados } from "@/components/articulos-destacados"
import { PropertyCardSquare } from "@/components/property-card-square"
import { INNOVA, innovaImg } from "@/lib/innova-media"
import { getPropiedadesResumen } from "@/lib/propiedades-resumen"
import { ArkinMotion } from "./arkin-motion"

export const revalidate = 60

const categories = [
  { label: "Comprar", detail: "Propiedades listas para habitar", icon: Home, href: "/venta" },
  { label: "Rentar", detail: "Tu próximo espacio, sin fricción", icon: KeyRound, href: "/renta" },
  { label: "Invertir", detail: "Oportunidades con visión", icon: Building2, href: "/desarrollos" },
]

export default async function HomePage() {
  // Pool amplio para sugerir propiedades relacionadas en los artículos; el home muestra las 3 más recientes
  const pool = await getPropiedadesResumen(24)
  const properties = pool.slice(0, 3)
  const featured = properties[0]

  return (
    <main className="arkin-rounded-ui relative overflow-hidden bg-arkin-secondary text-arkin-accent">
      <ArkinMotion />
      <section className="relative m-2 rounded-[2.5rem] bg-arkin-accent text-white sm:rounded-[3.5rem] md:min-h-[92svh]">
        <div className="arkin-hero-media absolute inset-0 overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem]">
          <Image
            src={innovaImg(INNOVA.campinaFachadaAtardecer)}
            alt="Residencia Campiña al atardecer"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,40,45,0.98)_0%,rgba(40,40,45,0.84)_40%,rgba(40,40,45,0.2)_76%,rgba(40,40,45,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,40,45,0.22)_0%,rgba(40,40,45,0)_45%,rgba(40,40,45,0.75)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[780px] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-36 sm:min-h-[820px] sm:px-8 md:min-h-[92svh] md:pb-32 lg:px-12">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-10 bg-arkin-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-arkin-primary sm:text-xs">
              Curaduría inmobiliaria · León, Gto.
            </span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <h1 className="max-w-5xl text-[clamp(3.5rem,9vw,8.4rem)] font-bold uppercase leading-[0.82] tracking-[-0.065em]">
                Espacios
                <span className="block text-arkin-primary">que elevan</span>
                <span className="block">tu historia.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/72 sm:text-lg">
                Una selección precisa de propiedades extraordinarias y acompañamiento experto para decidir con claridad.
              </p>
            </div>

            <div data-reveal className="arkin-dark-glass hidden rounded-[2rem] p-7 lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-primary">Propiedad destacada</p>
              <p className="mt-4 text-2xl font-medium">{featured.title}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/65">
                <MapPin className="h-4 w-4 text-arkin-primary" />
                {featured.location}
              </div>
              <Link href={featured.id ? `/propiedades/${featured.id}` : "/propiedades"} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-arkin-primary">
                Explorar selección <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-24 px-5 pb-5 sm:px-8 md:absolute md:bottom-0 md:left-0 md:right-0 md:mt-0 md:translate-y-1/2 md:pb-0 lg:px-12">
          <div className="arkin-soft-glass mx-auto max-w-[1344px] rounded-[2rem] p-3 sm:rounded-[2.5rem] sm:p-4">
            <form action="/propiedades" className="grid gap-2 md:grid-cols-[1.1fr_1fr_1fr_auto]">
              <label className="group flex min-h-16 items-center gap-4 rounded-[1.25rem] border border-white/45 bg-arkin-secondary/45 px-5 transition-colors focus-within:border-arkin-accent/40">
                <Search className="h-5 w-5 shrink-0 text-arkin-accent" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/45">¿Qué buscas?</span>
                  <input name="search" aria-label="Qué propiedad buscas" placeholder="Casa, departamento, terreno..." className="w-full bg-transparent pt-1 text-sm outline-none placeholder:text-arkin-accent/55" />
                </span>
              </label>
              <label className="flex min-h-16 items-center gap-4 rounded-[1.25rem] border border-white/45 bg-arkin-secondary/45 px-5">
                <MapPin className="h-5 w-5 shrink-0 text-arkin-accent" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/45">Ubicación</span>
                  <select name="location" aria-label="Ubicación" className="mt-1 w-full appearance-none bg-transparent text-sm outline-none">
                    <option>León, Guanajuato</option>
                    <option>Ciudad de México</option>
                    <option>Querétaro</option>
                  </select>
                </span>
              </label>
              <label className="flex min-h-16 items-center gap-4 rounded-[1.25rem] border border-white/45 bg-arkin-secondary/45 px-5">
                <Building2 className="h-5 w-5 shrink-0 text-arkin-accent" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-arkin-accent/45">Operación</span>
                  <select name="operation" aria-label="Tipo de operación" className="mt-1 w-full appearance-none bg-transparent text-sm outline-none">
                    <option>Comprar</option>
                    <option>Rentar</option>
                    <option>Invertir</option>
                  </select>
                </span>
              </label>
              <button type="submit" className="flex min-h-16 items-center justify-center gap-3 rounded-[1.25rem] bg-arkin-primary px-7 text-sm font-bold text-arkin-accent transition-all hover:-translate-y-0.5 hover:bg-arkin-accent hover:text-arkin-primary">
                Buscar <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-10 sm:px-8 md:pt-36 lg:px-12 lg:pb-32">
        <div className="-mx-5 -mt-6 mb-10 sm:-mx-8 lg:-mx-12">
          <HomepageAdSlot ubicacion="banner-hero" />
        </div>
        <div className="mx-auto max-w-[1344px]">
          <div data-reveal className="arkin-soft-glass grid gap-2 rounded-[2.25rem] p-3 md:grid-cols-3">
            {categories.map(({ label, detail, icon: Icon, href }, index) => (
              <Link key={label} href={href} className="group flex items-center gap-5 rounded-[1.5rem] border border-white/35 bg-arkin-secondary/30 px-5 py-6 transition-all hover:-translate-y-1 hover:bg-arkin-secondary/70 md:px-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-arkin-accent text-arkin-primary transition-transform group-hover:rotate-3 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold uppercase tracking-[-0.02em]">{label}</span>
                  <span className="mt-1 block text-xs text-arkin-accent/55">{detail}</span>
                </span>
                <span className="font-mono text-xs text-arkin-accent/35">0{index + 1}</span>
              </Link>
            ))}
          </div>

          <div data-reveal className="mb-10 mt-28 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-arkin-accent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-accent/60">Propiedades selectas</span>
              </div>
              <h2 className="max-w-2xl text-4xl font-bold uppercase leading-[0.92] tracking-[-0.055em] sm:text-6xl">
                Lugares para una
                <span className="block">vida excepcional.</span>
              </h2>
            </div>
            <Link href="/propiedades" className="group inline-flex items-center gap-3 rounded-full border border-arkin-accent/15 bg-arkin-secondary/60 px-5 py-3 text-sm font-bold shadow-sm">
              Ver todo el catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCardSquare key={property.id ?? property.title} property={property} reveal />
            ))}
          </div>
        </div>
      </section>

      <HomepageAdSlot ubicacion="entre-secciones" fallback />

      <section data-reveal className="relative mx-2 overflow-hidden rounded-[2.75rem] bg-arkin-accent px-5 py-24 text-white sm:rounded-[4rem] sm:px-8 lg:px-12 lg:py-32">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-arkin-secondary/10 blur-3xl" />
        <div className="mx-auto grid max-w-[1344px] gap-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <div className="mb-6 flex items-center gap-3 text-arkin-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em]">El estándar ARKIN</span>
            </div>
            <h2 className="text-4xl font-bold uppercase leading-[0.92] tracking-[-0.055em] sm:text-6xl">
              Mucho más que encontrar una propiedad.
            </h2>
            <p className="mt-7 max-w-lg text-base font-light leading-relaxed text-white/62">
              Reunimos conocimiento local, datos claros y una red especializada para que cada decisión inmobiliaria se sienta simple, segura y personal.
            </p>
            <Link href="/servicios" className="mt-9 inline-flex items-center gap-3 rounded-full bg-arkin-primary px-6 py-4 text-sm font-bold text-arkin-accent transition-transform hover:-translate-y-1">
              Conocer nuestro método <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, number: "01", title: "Información verificada", text: "Datos esenciales y documentación revisada antes de avanzar." },
              { icon: Search, number: "02", title: "Curaduría real", text: "Menos ruido. Opciones relevantes según tu momento y objetivos." },
              { icon: Building2, number: "03", title: "Visión de inversión", text: "Contexto de zona y potencial para decidir con perspectiva." },
              { icon: Check, number: "04", title: "Acompañamiento", text: "Un asesor presente desde la primera visita hasta el cierre." },
            ].map(({ icon: Icon, number, title, text }) => (
              <div data-reveal key={number} className="arkin-dark-glass min-h-60 rounded-[2rem] p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-arkin-primary" />
                  <span className="font-mono text-xs text-white/25">{number}</span>
                </div>
                <h3 className="mt-16 text-xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/52">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1344px]">
          <div data-reveal className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative min-h-[560px] overflow-hidden rounded-[2.75rem] sm:min-h-[680px] sm:rounded-[3.5rem]">
              <Image src={innovaImg(INNOVA.campinaDobleAltura)} alt="Estancia a doble altura en Residencia Campiña" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 65vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-arkin-accent/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-arkin-primary">Historias de espacios</p>
                <h3 className="mt-4 max-w-2xl text-3xl font-bold uppercase leading-none tracking-[-0.04em] sm:text-5xl">
                  Arquitectura que se vive, no solo se mira.
                </h3>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2.75rem] bg-arkin-primary p-8 shadow-[0_28px_70px_rgba(40,40,45,0.16)] sm:rounded-[3.5rem] sm:p-10">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1rem] border border-arkin-accent/25">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <p className="mt-14 text-[11px] font-bold uppercase tracking-[0.2em] text-arkin-accent/55">Para propietarios</p>
                <h3 className="mt-5 text-4xl font-bold uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl">
                  Tu propiedad merece una presentación memorable.
                </h3>
                <p className="mt-6 text-sm leading-relaxed text-arkin-accent/65">
                  Estrategia, fotografía y difusión construidas para destacar el verdadero valor de tu inmueble.
                </p>
              </div>
              <Link href="/propietarios" className="mt-16 flex items-center justify-between rounded-full border border-arkin-accent/20 bg-arkin-secondary/25 px-5 py-4 text-sm font-bold">
                Publicar con ARKIN <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[1344px]">
          <div data-reveal className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <BookOpen className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-accent/60">Revista ARKIN</span>
              </div>
              <h2 className="max-w-2xl text-4xl font-bold uppercase leading-[0.92] tracking-[-0.055em] sm:text-6xl">
                Una casa para
                <span className="block">cada etapa.</span>
              </h2>
            </div>
            <Link href="/articulos" className="group inline-flex items-center gap-3 rounded-full border border-arkin-accent/15 bg-arkin-secondary/60 px-5 py-3 text-sm font-bold shadow-sm">
              Ver todos los artículos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ArticulosDestacados propiedades={pool} reveal />
        </div>
      </section>

      <HomepageAdSlot ubicacion="footer" />

      <section className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div data-reveal className="arkin-soft-glass mx-auto flex max-w-[1344px] flex-col items-start justify-between gap-10 rounded-[2.75rem] p-8 sm:p-12 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-arkin-accent/50">Tu siguiente movimiento</p>
            <h2 className="mt-5 max-w-4xl text-5xl font-bold uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
              Empieza por un espacio que sí se sienta tuyo.
            </h2>
          </div>
          <Link href="/contacto" className="flex shrink-0 items-center gap-4 rounded-full bg-arkin-accent px-7 py-5 text-sm font-bold text-white transition-colors hover:bg-arkin-primary hover:text-arkin-accent">
            Hablar con un asesor <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <AIAgent />
    </main>
  )
}

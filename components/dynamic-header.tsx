"use client"

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import {
  Menu,
  X,
  Home,
  Building,
  Search,
  Heart,
  MapPin,
  Shield,
  UserCircle,
  ChevronDown,
  Tag,
  Key,
  Percent,
  Camera,
  Briefcase,
  ArrowUpRight,
} from "lucide-react"
import { WishlistCounter } from "./wishlist-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/propiedades", label: "Propiedades", icon: Building },
  { href: "/contacto", label: "Contacto", icon: MapPin },
]

const otrosItems = [
  { href: "/venta", label: "Venta", icon: Tag },
  { href: "/renta", label: "Renta", icon: Key },
  { href: "/ofertas", label: "Ofertas", icon: Percent },
]

const categorias = [
  { href: "/venta", label: "Venta", icon: Tag },
  { href: "/renta", label: "Renta", icon: Key },
  { href: "/ofertas", label: "Ofertas", icon: Percent },
]

const panelHref = (role?: string) =>
  role === "admin" ? "/panel-admin" :
    role === "propietario" ? "/panel-propietario" :
      role === "fotografo" ? "/panel-fotografo" :
        role === "broker" ? "/panel-broker" :
          role === "empresa" ? "/panel-empresa" :
            "/panel-asesor"

const panelLabel = (role?: string) =>
  role === "admin" ? { label: "Admin", icon: Shield } :
    role === "propietario" ? { label: "Mi Propiedad", icon: Building } :
      role === "fotografo" ? { label: "Mi Panel", icon: Camera } :
        role === "empresa" ? { label: "Mi Empresa", icon: Briefcase } :
          { label: "Mi Panel", icon: UserCircle }

/** Hora local de León (se monta solo en cliente para evitar desajustes de hidratación) */
function useLeonClock() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Mexico_City" })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function DynamicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOtrosMenuOpen, setIsOtrosMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const time = useLeonClock()

  // Indicador deslizante del nav
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [hovered, setHovered] = useState<string | null>(null)
  const [pill, setPill] = useState<{ left: number; width: number; visible: boolean }>({ left: 0, width: 0, visible: false })

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setIsScrolled(window.scrollY > 20)
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }

    // Animación de entrada
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const activeHref = navItems.find((i) => isActive(i.href))?.href ?? null
  const target = hovered ?? activeHref

  const measure = useCallback(() => {
    const el = target ? itemRefs.current[target] : null
    if (!el || !navRef.current) return setPill((p) => ({ ...p, visible: false }))
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
  }, [target])

  useLayoutEffect(() => {
    measure()
  }, [measure, isScrolled])

  useEffect(() => {
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // Detectar si estamos en una página de panel
  const isInPanel = pathname.startsWith('/panel-admin') || pathname.startsWith('/panel-asesor') || pathname.startsWith('/panel-broker') || pathname.startsWith('/panel-fotografo') || pathname.startsWith('/panel-empresa')

  const panel = panelLabel(user?.role)
  const PanelIcon = panel.icon

  return (
    <>
      {/* Dynamic Island Header */}
      <div className={`
        fixed left-1/2 -translate-x-1/2 z-50
        ${isInPanel
          ? 'bottom-6 top-auto'  // En panel: siempre abajo
          : 'md:top-5 md:bottom-auto bottom-5 top-auto'  // Fuera del panel: arriba en desktop, abajo en móvil
        }
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isLoaded ? 'translate-y-0 opacity-100 blur-0' : `${isInPanel ? 'translate-y-4' : 'md:-translate-y-6 translate-y-4'} opacity-0 blur-sm`}
      `}>
        <div
          className={`
            arkin-island relative isolate overflow-visible
            mx-auto md:origin-top origin-bottom text-white
            bg-[#18181b]/90 backdrop-blur-2xl backdrop-saturate-150
            ring-1 ring-white/10
            shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isMobileMenuOpen
              ? 'rounded-[30px] p-5 w-[min(92vw,380px)]'
              : `rounded-full max-w-fit ${isScrolled ? 'p-1 md:scale-[0.96]' : 'p-1.5'}`
            }
          `}
        >
          {/* Progreso de scroll: un hilo canary que recorre la base de la isla */}
          {!isMobileMenuOpen && (
            <span aria-hidden className="pointer-events-none absolute inset-x-6 -bottom-px h-px overflow-hidden rounded-full">
              <span
                className="block h-full origin-left bg-gradient-to-r from-transparent via-arkin-primary to-arkin-primary transition-transform duration-150"
                style={{ transform: `scaleX(${progress})` }}
              />
            </span>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 min-w-0">
            {/* Logo + reloj de León */}
            <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0 rounded-full bg-white/[0.06] py-1 pl-1 pr-3.5 transition-colors hover:bg-white/10">
              <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-arkin-primary/40 transition-transform duration-500 group-hover:rotate-[-8deg]">
                <Image src="/arkinlogo.jpg" alt="ARKIN SELECT" fill sizes="32px" className="object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[10px] font-black uppercase tracking-[0.22em]">Arkin</span>
                <span className="mt-1 flex items-center gap-1.5 font-mono text-[9px] tabular-nums text-white/45">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arkin-primary opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-arkin-primary" />
                  </span>
                  LEÓN {time ?? "--:--"}
                </span>
              </span>
            </Link>

            {/* Navigation Items con indicador deslizante */}
            <nav ref={navRef} className="relative flex items-center min-w-0 px-1" onMouseLeave={() => setHovered(null)}>
              <span
                aria-hidden
                className={`absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-arkin-primary transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${pill.visible ? 'opacity-100' : 'opacity-0'}`}
                style={{ left: pill.left, width: pill.width }}
              />
              {navItems.map((item) => {
                const lit = target === item.href
                return (
                  <Link
                    key={item.href}
                    ref={(el) => { itemRefs.current[item.href] = el }}
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative z-10 flex h-8 items-center px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${lit ? 'text-arkin-accent' : 'text-white/60 hover:text-white'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Acciones rápidas */}
            <div className="flex items-center flex-shrink-0 rounded-full bg-white/[0.06] p-0.5">
              <Link
                href="/favoritos"
                aria-label="Favoritos"
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-arkin-primary"
              >
                <Heart className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                aria-label="Buscar"
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-arkin-primary"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0 pl-1">
              <Link
                href="/propietarios"
                className="group flex h-8 items-center gap-1.5 rounded-full bg-arkin-primary pl-4 pr-1 text-xs font-bold text-arkin-accent transition-all duration-300 hover:shadow-[0_0_24px_-4px_var(--arkin-primary)]"
              >
                Vender
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-arkin-accent text-arkin-primary transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
              <Link
                href="/alianza-comercial"
                className="flex h-8 items-center rounded-full px-3.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 transition-all duration-300 hover:bg-white hover:text-arkin-accent"
              >
                Asesor
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOtrosMenuOpen(!isOtrosMenuOpen)}
                  aria-expanded={isOtrosMenuOpen}
                  className={`flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors duration-300 ${isOtrosMenuOpen ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Otros
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOtrosMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOtrosMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsOtrosMenuOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-3 w-56 origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-200 rounded-[22px] bg-[#18181b]/95 p-1.5 ring-1 ring-white/10 backdrop-blur-2xl shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)] z-50">
                      {otrosItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <div key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setIsOtrosMenuOpen(false)}
                              className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/[0.06] text-arkin-primary transition-colors group-hover:bg-arkin-primary group-hover:text-arkin-accent">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              {item.label}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Panel Interno Access - Desktop */}
              {isAuthenticated && user ? (
                <Link
                  href={panelHref(user.role)}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-bold text-arkin-accent transition-all duration-300 hover:bg-arkin-primary"
                >
                  <PanelIcon className="h-3.5 w-3.5" />
                  {panel.label}
                </Link>
              ) : (
                <Link
                  href="/login"
                  aria-label="Acceso"
                  title="Acceso"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition-all duration-300 hover:bg-white hover:text-arkin-accent"
                >
                  <UserCircle className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {!isMobileMenuOpen ? (
              <div className="flex items-center gap-1.5">
                {/* Mobile Logo */}
                <Link href="/" className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-arkin-primary/40">
                  <Image src="/arkinlogo.jpg" alt="ARKIN SELECT" fill sizes="36px" className="object-cover" />
                </Link>

                <span className="whitespace-nowrap px-2 font-mono text-[10px] tabular-nums text-white/45">LEÓN {time ?? "--:--"}</span>

                {/* Menú button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex h-9 items-center gap-2 rounded-full bg-arkin-primary px-4 text-sm font-bold text-arkin-accent active:scale-95 transition-transform"
                >
                  <Menu className="h-4 w-4" />
                  Menú
                </button>

                {/* Heart icon */}
                <Link
                  href="/favoritos"
                  aria-label="Favoritos"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/70 active:scale-95 transition-transform"
                >
                  <Heart className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 w-full animate-in fade-in duration-300">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                    <span className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-arkin-primary/40">
                      <Image src="/arkinlogo.jpg" alt="ARKIN SELECT" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="flex flex-col leading-none">
                      <span className="text-xs font-black uppercase tracking-[0.22em]">Arkin Select</span>
                      <span className="mt-1.5 font-mono text-[10px] tabular-nums text-white/45">LEÓN {time ?? "--:--"}</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Cerrar menú"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition-transform active:scale-90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Navigation — lista grande numerada */}
                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ animationDelay: `${index * 40}ms` }}
                      className={`group flex items-center justify-between rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 transition-colors ${isActive(item.href) ? 'bg-arkin-primary text-arkin-accent' : 'text-white hover:bg-white/[0.06]'}`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className={`font-mono text-[10px] ${isActive(item.href) ? 'text-arkin-accent/50' : 'text-white/30'}`}>0{index + 1}</span>
                        <span className="text-xl font-bold uppercase tracking-[-0.03em]">{item.label}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform group-hover:rotate-45" />
                    </Link>
                  ))}
                </nav>

                {/* Categorías Dropdown */}
                <div className="border-t border-white/10 pt-3">
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-white/[0.05] transition-colors hover:bg-white/[0.08]"
                  >
                    <span className="text-sm font-semibold">Categorías</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoriesOpen && (
                    <div className="mt-2 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                      {categorias.map((c) => {
                        const Icon = c.icon
                        return (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
                          >
                            <Icon className="h-4 w-4 text-arkin-primary" />
                            {c.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.05] py-3 text-sm text-white/80 transition-colors hover:bg-white/10">
                    <Search className="h-4 w-4" />
                    Buscar
                  </button>
                  <Link
                    href="/favoritos"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.05] py-3 text-sm text-white/80 transition-colors hover:bg-white/10"
                  >
                    <WishlistCounter />
                    Favoritos
                  </Link>
                </div>

                {/* Primary Action */}
                <div className="space-y-2">
                  {isAuthenticated && user ? (
                    <Link
                      href={user.role === 'propietario' ? '/panel-propietario' : user.role === 'admin' ? '/panel-admin' : user.role === 'broker' ? '/panel-broker' : user.role === 'fotografo' ? '/panel-fotografo' : '/panel-asesor'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-arkin-primary py-3.5 text-sm font-bold text-arkin-accent"
                    >
                      {user.role === 'propietario' ? (
                        <><Building className="h-4 w-4" /> Mi Propiedad</>
                      ) : user.role === 'admin' ? (
                        <><Shield className="h-4 w-4" /> Panel Admin</>
                      ) : (
                        <><UserCircle className="h-4 w-4" /> Mi Panel</>
                      )}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/propietarios"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-2xl bg-arkin-primary py-2 pl-5 pr-2 text-sm font-bold text-arkin-accent"
                      >
                        Vender mi Propiedad
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-arkin-accent text-arkin-primary">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/alianza-comercial"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/20"
                        >
                          <UserCircle className="h-4 w-4" />
                          Soy Asesor
                        </Link>
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.05] py-3 text-sm font-semibold text-white/80"
                        >
                          <Shield className="h-4 w-4" />
                          Acceso Interno
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-white/40">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> León, Gto.</span>
                  <a href="tel:+5214774756951">+52 1 477 475 6951</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

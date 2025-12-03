"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Home,
  Building,
  User,
  Users,
  Search,
  Heart,
  MapPin,
  Shield,
  UserCircle,
  ChevronDown,
  Tag,
  Key,
  Sparkles,
  Percent,
  Palette,
  Camera
} from "lucide-react"
import { WishlistCounter } from "./wishlist-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

export function DynamicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOtrosMenuOpen, setIsOtrosMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Animación de entrada
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/propiedades", label: "Propiedades", icon: Building },
    { href: "/propietarios", label: "Propietarios", icon: User },
    { href: "/contacto", label: "Contacto", icon: MapPin },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  // Detectar si estamos en una página de panel
  const isInPanel = pathname.startsWith('/panel-admin') || pathname.startsWith('/panel-asesor')

  return (
    <>
      {/* Dynamic Island Header */}
      <div className={`
        fixed left-1/2 transform -translate-x-1/2 z-50 
        ${isInPanel
          ? 'bottom-6 top-auto'  // En panel: siempre abajo
          : 'md:top-6 md:bottom-auto bottom-6 top-auto'  // Fuera del panel: arriba en desktop, abajo en móvil
        }
        transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
        ${isLoaded ? 'translate-y-0 opacity-100' : `${isInPanel ? 'translate-y-4' : 'md:translate-y-[-16px] translate-y-4'} opacity-0`}
      `}>
        <div
          className={`
            transform-gpu will-change-transform
            mx-auto md:origin-top origin-bottom
            transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
            ${isMobileMenuOpen
              ? `rounded-[28px] px-6 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] min-w-[320px] 
                 backdrop-blur-2xl bg-arkin-secondary/95
                 border border-arkin-accent/20
                 shadow-2xl shadow-black/20
                 transform scale-100 opacity-100`
              : `rounded-full px-5 py-2.5 max-w-fit
                 ${isScrolled
                ? 'backdrop-blur-2xl bg-arkin-secondary/95 border border-arkin-accent/20 shadow-2xl shadow-black/20 px-4 py-2 scale-[0.95]'
                : 'backdrop-blur-md bg-white/10 border border-white/20 shadow-lg'
              }
                 transform scale-100 opacity-100`
            }
            hover:shadow-xl
          `}
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-2 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 px-2">
              <Image
                src="/arkinlogo.jpg"
                alt="ARKIN SELECT"
                width={120}
                height={40}
                className="h-7 w-auto object-contain transition-all duration-300"
              />
            </Link>

            {/* Separator */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-arkin-accent/40 to-transparent flex-shrink-0"></div>

            {/* Navigation Items */}
            <nav className="flex items-center gap-1 min-w-0">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full
                      transition-all duration-300 ease-out flex-shrink-0 min-w-[80px]
                      ${isActive(item.href)
                        ? 'bg-arkin-primary/20 text-arkin-primary font-semibold shadow-sm shadow-arkin-primary/20'
                        : `${isScrolled ? 'text-arkin-accent/70 hover:text-arkin-primary hover:bg-arkin-primary/10' : 'text-white/90 hover:text-white hover:bg-white/10'} hover:shadow-sm`
                      }
                    `}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:scale-110" />
                    <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-arkin-primary rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-0 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full w-8 h-8 p-0 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md ${isScrolled ? 'text-arkin-accent/70 hover:bg-arkin-primary/10 hover:text-arkin-primary' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full w-8 h-8 p-0 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md ${isScrolled ? 'text-arkin-accent/70 hover:bg-arkin-primary/10 hover:text-arkin-primary' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
              >
                <Heart className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Separator */}
            <div className="w-px h-4 bg-arkin-accent/20 mx-1"></div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link href="/propietarios">
                <Button
                  size="sm"
                  className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent rounded-full px-4 py-1.5 font-semibold text-xs h-8 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-arkin-primary/20 whitespace-nowrap flex items-center gap-1.5"
                >
                  <Building className="h-3 w-3" />
                  Vender
                </Button>
              </Link>
              <Link href="/alianza-comercial">
                <Button
                  size="sm"
                  className="bg-arkin-secondary hover:bg-arkin-secondary/90 text-white border border-arkin-accent/20 rounded-full px-4 py-1.5 font-semibold text-xs h-8 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap flex items-center gap-1.5"
                >
                  <User className="h-3 w-3" />
                  Asesor
                </Button>
              </Link>
              <div className="relative">
                <Button
                  size="sm"
                  onClick={() => setIsOtrosMenuOpen(!isOtrosMenuOpen)}
                  className={`rounded-full px-3 py-1.5 font-medium text-xs h-8 transition-all duration-300 hover:scale-105 hover:shadow-md whitespace-nowrap flex items-center gap-1.5 ${isScrolled ? 'bg-arkin-accent/10 hover:bg-arkin-accent/20 text-arkin-accent' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  Otros
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOtrosMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* Dropdown Menu */}
                {isOtrosMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsOtrosMenuOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-arkin-secondary/95 backdrop-blur-xl border border-arkin-accent/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="py-2">
                        <Link href="/venta" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Tag className="h-4 w-4 text-arkin-primary" />
                            <span>Venta</span>
                          </button>
                        </Link>
                        <Link href="/renta" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Key className="h-4 w-4 text-arkin-primary" />
                            <span>Renta</span>
                          </button>
                        </Link>
                        <Link href="/especiales" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-arkin-primary" />
                            <span>Especiales</span>
                          </button>
                        </Link>
                        <Link href="/ofertas" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Percent className="h-4 w-4 text-arkin-primary" />
                            <span>Ofertas</span>
                          </button>
                        </Link>
                        <Link href="/exclusivos" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Shield className="h-4 w-4 text-arkin-primary" />
                            <span>Exclusivos</span>
                          </button>
                        </Link>
                        <div className="border-t border-arkin-accent/20 my-2"></div>
                        <Link href="/desarrollos" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Building className="h-4 w-4 text-arkin-primary" />
                            <span>Desarrollos</span>
                          </button>
                        </Link>
                        <Link href="/brokers" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Users className="h-4 w-4 text-arkin-primary" />
                            <span>Brokers y Notarías</span>
                          </button>
                        </Link>
                        <div className="border-t border-arkin-accent/20 my-2"></div>
                        <Link href="/ficha-marca" onClick={() => setIsOtrosMenuOpen(false)}>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-arkin-accent hover:bg-arkin-primary/10 transition-colors flex items-center gap-2">
                            <Palette className="h-4 w-4 text-arkin-gold" />
                            <span>Ficha de Marca</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Separator */}
              <div className="w-px h-4 bg-arkin-accent/30 mx-1 flex-shrink-0"></div>

              {/* Panel Interno Access - Desktop */}
              {isAuthenticated && user ? (
                <Link
                  href={
                    user.role === 'admin' ? '/panel-admin' :
                      user.role === 'propietario' ? '/panel-propietario' :
                        user.role === 'fotografo' ? '/panel-fotografo' :
                          '/panel-asesor'
                  }
                >
                  <Button
                    size="sm"
                    className="bg-arkin-gold hover:bg-arkin-gold/90 text-black rounded-full px-2 py-0.5 font-medium text-xs h-5 ml-0.5 transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center gap-1"
                  >
                    {user.role === 'admin' ? (
                      <>
                        <Shield className="h-2.5 w-2.5" />
                        <span>Admin</span>
                      </>
                    ) : user.role === 'propietario' ? (
                      <>
                        <Building className="h-2.5 w-2.5" />
                        <span>Mi Propiedad</span>
                      </>
                    ) : user.role === 'fotografo' ? (
                      <>
                        <Camera className="h-2.5 w-2.5" />
                        <span>Mi Panel</span>
                      </>
                    ) : (
                      <>
                        <UserCircle className="h-2.5 w-2.5" />
                        <span>Mi Panel</span>
                      </>
                    )}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className={`rounded-full px-2 py-0.5 font-medium text-xs h-5 ml-0.5 transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center gap-1 ${isScrolled ? 'bg-arkin-accent/10 hover:bg-arkin-accent/20 text-arkin-accent' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                    <UserCircle className="h-2.5 w-2.5" />
                    <span>Acceso</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {!isMobileMenuOpen ? (
              <div className="flex items-center justify-between w-full pl-3 pr-1">
                {/* Mobile Logo */}
                <Link href="/" className="flex items-center flex-shrink-0 mr-4">
                  <Image
                    src="/arkinlogo.jpg"
                    alt="ARKIN SELECT"
                    width={120}
                    height={35}
                    className="h-6 w-auto object-contain transition-all duration-300"
                  />
                </Link>

                {/* Mobile Action Icons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-6 h-6 p-0 flex items-center justify-center hover:bg-arkin-primary/10 hover:text-arkin-primary transition-all duration-300 hover:scale-110"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                  <Link href="/favoritos">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-6 h-6 p-0 flex items-center justify-center hover:bg-arkin-primary/10 hover:text-arkin-primary transition-all duration-300 hover:scale-110"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="rounded-full w-6 h-6 p-0 flex items-center justify-center hover:bg-arkin-primary/10 transition-all duration-300 hover:scale-110"
                  >
                    <Menu className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full transition-all duration-300 ease-out">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between transition-all duration-200 ease-out">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/arkinlogo.jpg"
                      alt="ARKIN SELECT"
                      width={160}
                      height={50}
                      className="h-8 w-auto object-contain"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full w-8 h-8 p-0 hover:bg-arkin-accent/10 transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation Grid - Apple Style */}
                <div className="grid grid-cols-2 gap-3 transition-all duration-200 ease-out">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex flex-col items-center space-y-2 px-4 py-4 rounded-2xl
                          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                          hover:scale-105 active:scale-95
                          opacity-100
                          ${isActive(item.href)
                            ? 'bg-arkin-primary/15 text-arkin-primary font-medium shadow-sm'
                            : 'text-arkin-accent/70 hover:text-arkin-primary hover:bg-arkin-accent/5'
                          }
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          transition-all duration-300 ease-out
                          ${isActive(item.href)
                            ? 'bg-arkin-primary/20 shadow-sm'
                            : 'bg-arkin-accent/10'
                          }
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Categorías Grid */}
                <div className="pt-3 border-t border-arkin-accent/20">
                  <p className="text-xs font-semibold text-arkin-accent/60 mb-3 px-1">CATEGORÍAS</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Link href="/venta" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-green-500/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Tag className="h-5 w-5 text-green-600" />
                        <span className="text-xs font-medium text-arkin-accent">Venta</span>
                      </button>
                    </Link>
                    <Link href="/renta" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Key className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium text-arkin-accent">Renta</span>
                      </button>
                    </Link>
                    <Link href="/especiales" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-purple-500/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <span className="text-xs font-medium text-arkin-accent">Especiales</span>
                      </button>
                    </Link>
                    <Link href="/ofertas" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-red-500/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Percent className="h-5 w-5 text-red-600" />
                        <span className="text-xs font-medium text-arkin-accent">Ofertas</span>
                      </button>
                    </Link>
                    <Link href="/exclusivos" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-arkin-primary/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Shield className="h-5 w-5 text-arkin-primary" />
                        <span className="text-xs font-medium text-arkin-accent">Exclusivos</span>
                      </button>
                    </Link>
                    <Link href="/desarrollos" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Building className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium text-arkin-accent">Desarrollos</span>
                      </button>
                    </Link>
                    <Link href="/brokers" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-teal-500/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Users className="h-5 w-5 text-teal-600" />
                        <span className="text-xs font-medium text-arkin-accent">Brokers</span>
                      </button>
                    </Link>
                    <Link href="/ficha-marca" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1.5 px-3 py-3 rounded-xl bg-arkin-accent/5 hover:bg-arkin-gold/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <Palette className="h-5 w-5 text-arkin-gold" />
                        <span className="text-xs font-medium text-arkin-accent">Ficha</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-3 border-t border-arkin-accent/20 transition-all duration-200 ease-out">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-arkin-accent/5 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Buscar</span>
                  </Button>
                  <Link href="/favoritos">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-arkin-accent/5 transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <WishlistCounter />
                      <span className="text-sm">Favoritos</span>
                    </Button>
                  </Link>
                </div>

                {/* Primary Action - Combined Button */}
                {isAuthenticated && user ? (
                  <>
                    {user.role === 'propietario' ? (
                      <Link
                        href="/panel-propietario"
                        className="transition-all duration-200 ease-out"
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-arkin-primary to-arkin-primary/80 hover:from-arkin-primary/90 hover:to-arkin-primary/70 text-white rounded-2xl font-semibold py-3 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Mi Propiedad
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href={user.role === 'admin' ? '/panel-admin' : '/panel-asesor'}
                        className="transition-all duration-200 ease-out"
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-arkin-primary to-arkin-primary/80 hover:from-arkin-primary/90 hover:to-arkin-primary/70 text-white rounded-2xl font-semibold py-3 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Panel Admin
                            </>
                          ) : (
                            <>
                              <UserCircle className="h-4 w-4 mr-2" />
                              Mi Panel
                            </>
                          )}
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/propietarios" className="transition-all duration-200 ease-out">
                      <Button
                        className="w-full bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent rounded-2xl font-semibold py-3 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Vender mi Propiedad
                      </Button>
                    </Link>
                    <Link href="/alianza-comercial" className="transition-all duration-200 ease-out">
                      <Button
                        className="w-full bg-arkin-secondary hover:bg-arkin-secondary/90 text-white border border-arkin-accent/20 rounded-2xl font-semibold py-3 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        Soy Asesor
                      </Button>
                    </Link>
                    <Link href="/login" className="transition-all duration-200 ease-out">
                      <Button
                        className="w-full bg-arkin-primary/10 hover:bg-arkin-primary/20 text-arkin-primary border-2 border-arkin-primary/30 rounded-2xl font-semibold py-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        Acceso Interno
                      </Button>
                    </Link>
                  </>
                )}

                {/* Contact Info */}
                <div className="text-center pt-3 border-t border-arkin-accent/20 transition-all duration-200 ease-out">
                  <div className="flex items-center justify-center space-x-2 text-sm text-arkin-accent/70 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>León, Guanajuato</span>
                  </div>
                  <div className="space-y-1 text-sm text-arkin-accent/60">
                    <div>+52 477 123 4567</div>
                    <div>hola@arkin.mx</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

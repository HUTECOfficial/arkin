"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Eye, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { usePropertiesStatic } from "@/hooks/use-properties-static"

export default function EspecialesPage() {
  // Hook optimizado - carga instantánea desde JSON + realtime
  const { properties } = usePropertiesStatic()
  const propiedades = useMemo(() => 
    properties.filter(p => p.categoria === 'especial'), 
    [properties]
  )

  return (
    <div className="min-h-screen bg-arkin-secondary transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-0 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-transparent"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://mnrfsdrjadretxesjxhu.supabase.co/storage/v1/object/sign/arkin/hf_20260219_015208_b75495b2-1016-45df-a1f8-d1160006831b.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTg2NjJkMS1lZjIzLTRkZjUtYjAwYy04NjVkOTcwYzljZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmtpbi9oZl8yMDI2MDIxOV8wMTUyMDhfYjc1NDk1YjItMTAxNi00NWRmLWExZjgtZDExNjAwMDY4MzFiLmpwZWciLCJpYXQiOjE3NzE0NjYyNTQsImV4cCI6MTgwMzAwMjI1NH0.0ew5z0WbvUkHQAwo8zOlhQFyLokmh2PKTqjqBtpxcuc')",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 text-balance px-4">
            Propiedades
            <span className="block text-purple-400">Especiales</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto text-pretty px-4">
            Propiedades premium con características únicas y ubicaciones privilegiadas
          </p>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-4 py-2 text-sm">
            {propiedades.length} Propiedades Exclusivas
          </Badge>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((propiedad) => (
              <div
                key={propiedad.id}
                className="group bg-arkin-secondary/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-500/30"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={propiedad.imagen || "/placeholder.svg"}
                    alt={propiedad.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {(propiedad as any).bono && (
                    <div className="absolute top-0 right-0 overflow-hidden w-full h-full pointer-events-none z-10">
                      <div
                        className="absolute top-6 -right-10 w-44 text-center py-2 text-[10px] font-black tracking-wider shadow-xl uppercase"
                        style={{
                          transform: 'rotate(45deg)',
                          background: 'linear-gradient(135deg, #8B6914, #C9A84C, #f0c040, #C9A84C, #8B6914)',
                          color: '#1a1a1a',
                          textShadow: '0 1px 0 rgba(255,255,255,0.3)',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                        }}
                      >
                        {(propiedad as any).bono}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-500/90 text-white backdrop-blur-sm text-xs">
                      Especial
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <WishlistButton 
                      property={{
                        id: propiedad.id.toString(),
                        title: propiedad.titulo,
                        price: propiedad.precioTexto,
                        location: propiedad.ubicacion,
                        image: propiedad.imagen,
                        bedrooms: propiedad.habitaciones,
                        bathrooms: propiedad.banos,
                        area: propiedad.areaTexto
                      }}
                      size="sm"
                    />
                    <Button size="sm" className="w-8 h-8 p-0 bg-arkin-secondary/50/90 hover:bg-arkin-secondary/50 text-gray-700 rounded-full">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-arkin-secondary text-gray-700 text-xs">{propiedad.tipo}</Badge>
                    <span className="text-2xl font-bold text-purple-600">{propiedad.precioTexto}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2">{propiedad.titulo}</h3>

                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{propiedad.ubicacion}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{propiedad.descripcion}</p>

                  {/* Property Details */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{propiedad.habitaciones}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{propiedad.banos}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{propiedad.areaTexto}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Visita
                    </Button>
                    <Link href={`/propiedades/${propiedad.id}`}>
                      <Button
                        variant="outline"
                        className="border-gray-200 hover:border-purple-600 hover:text-purple-600 rounded-xl"
                      >
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {propiedades.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay propiedades especiales disponibles</h3>
              <p className="text-gray-600 mb-6">Vuelve pronto para ver nuevas propiedades</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

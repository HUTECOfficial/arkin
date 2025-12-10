"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyFilters } from "@/components/property-filters"
import { AISearchChat } from "@/components/ai-search-chat"
import { MapPin, Bed, Bath, Square, Eye, Calendar, Grid, List, Map, Search, Sparkles, MessageSquare, RefreshCw } from "lucide-react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { Propiedad } from "@/data/propiedades"
import { usePropertiesStatic } from "@/hooks/use-properties-static"

export default function PropiedadesPage() {
  // Hook con datos estáticos + realtime - carga instantánea
  const { properties: propiedades, isLoading, refresh, realtimeCount } = usePropertiesStatic()
  
  const [filters, setFilters] = useState<any>({})
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [sortBy, setSortBy] = useState('precio-desc')
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

  // El hook usePropertiesStatic ya maneja realtime automáticamente


  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = propiedades.filter(propiedad => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = `${propiedad.titulo} ${propiedad.ubicacion} ${propiedad.descripcion} ${propiedad.caracteristicas.join(' ')}`.toLowerCase()
        if (!searchableText.includes(searchTerm)) return false
      }

      // Location filter
      if (filters.location && propiedad.ubicacion !== filters.location) return false

      // Property type filter
      if (filters.propertyType && propiedad.tipo !== filters.propertyType) return false

      // Price range filter
      if (filters.priceRange) {
        if (propiedad.precio < filters.priceRange[0] || propiedad.precio > filters.priceRange[1]) return false
      }

      // Bedrooms filter
      if (filters.bedrooms && propiedad.habitaciones < parseInt(filters.bedrooms)) return false

      // Bathrooms filter
      if (filters.bathrooms && propiedad.banos < parseInt(filters.bathrooms)) return false

      // Area range filter
      if (filters.areaRange) {
        if (propiedad.area < filters.areaRange[0] || propiedad.area > filters.areaRange[1]) return false
      }

      // Status filter
      if (filters.status && propiedad.status !== filters.status) return false

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity: string) =>
          propiedad.caracteristicas.some(caracteristica =>
            caracteristica.toLowerCase().includes(amenity.toLowerCase())
          )
        )
        if (!hasAllAmenities) return false
      }

      return true
    })

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'precio-asc':
          return a.precio - b.precio
        case 'precio-desc':
          return b.precio - a.precio
        case 'area-asc':
          return a.area - b.area
        case 'area-desc':
          return b.area - a.area
        case 'fecha-desc':
          return new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
        case 'fecha-asc':
          return new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [propiedades, filters, sortBy])

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-arkin-secondary transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-0 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[400px] sm:min-h-[600px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/fondoarkin.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 text-balance px-4">
            Propiedades
            <span className="block text-arkin-primary">Exclusivas</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Badge className="bg-arkin-primary/20 text-arkin-primary border-arkin-primary/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
              {isLoading ? 'Cargando...' : `${filteredAndSortedProperties.length} de ${propiedades.length} Propiedades`}
            </Badge>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <PropertyFilters
                onFiltersChange={handleFiltersChange}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
              />

              {/* AI Search Button */}
              <div className="bg-gradient-to-br from-arkin-primary/10 to-arkin-primary/5 border border-arkin-primary/20 rounded-2xl p-4 sm:p-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-arkin-primary rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-arkin-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-arkin-accent mb-1.5 sm:mb-2">
                      Búsqueda con IA
                    </h3>
                    <p className="text-xs sm:text-sm text-arkin-accent/70 leading-relaxed">
                      Describe la propiedad que buscas y nuestro asistente inteligente te ayudará a encontrarla
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAIChatOpen(true)}
                    className="w-full bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Iniciar Chat IA
                  </Button>
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-arkin-accent/60">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Asistente disponible 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-arkin-accent">
                    {filteredAndSortedProperties.length} Propiedades
                  </h2>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 border-arkin-accent/20 focus:border-arkin-primary text-sm">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="precio-desc">Precio: Mayor a menor</SelectItem>
                      <SelectItem value="precio-asc">Precio: Menor a mayor</SelectItem>
                      <SelectItem value="area-desc">Área: Mayor a menor</SelectItem>
                      <SelectItem value="area-asc">Área: Menor a mayor</SelectItem>
                      <SelectItem value="fecha-desc">Más recientes</SelectItem>
                      <SelectItem value="fecha-asc">Más antiguos</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`rounded-none ${viewMode === 'grid' ? 'bg-arkin-primary text-arkin-accent hover:bg-arkin-primary/90' : ''}`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`rounded-none ${viewMode === 'list' ? 'bg-arkin-primary text-arkin-accent hover:bg-arkin-primary/90' : ''}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'map' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('map')}
                      className={`rounded-none ${viewMode === 'map' ? 'bg-arkin-primary text-arkin-accent hover:bg-arkin-primary/90' : ''}`}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Properties Grid/List */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {filteredAndSortedProperties.map((propiedad) => (
                    <div
                      key={propiedad.id}
                      className="group bg-arkin-secondary/80 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-arkin-accent/10 hover:border-arkin-primary/30"
                    >
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          src={propiedad.imagen || "/placeholder.svg"}
                          alt={propiedad.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                          <Badge
                            className={`${propiedad.status === "Disponible"
                              ? "bg-green-500/90 text-white"
                              : propiedad.status === "Exclusiva"
                                ? "bg-arkin-primary/90 text-arkin-accent"
                                : "bg-red-500/90 text-white"
                              } backdrop-blur-sm text-xs`}
                          >
                            {propiedad.status}
                          </Badge>
                        </div>
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-1.5 sm:space-x-2">
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
                          <Button size="sm" className="w-8 h-8 p-0 bg-arkin-secondary/90 hover:bg-arkin-secondary text-arkin-accent rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <Badge className="bg-arkin-accent/10 text-arkin-accent text-[10px] sm:text-xs">{propiedad.tipo}</Badge>
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-arkin-primary">{propiedad.precioTexto}</span>
                        </div>

                        <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-arkin-accent mb-1.5 sm:mb-2 line-clamp-2 uppercase">{propiedad.titulo}</h3>

                        <div className="flex items-center text-arkin-accent/70 mb-3 sm:mb-4">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm line-clamp-1">{propiedad.ubicacion}</span>
                        </div>

                        <p className="text-arkin-accent/70 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{propiedad.descripcion}</p>

                        {/* Property Details */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm text-arkin-accent/60">
                          <div className="flex items-center space-x-3 sm:space-x-4">
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

                        {/* Features */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                          {propiedad.caracteristicas.slice(0, 2).map((caracteristica, index) => (
                            <Badge key={index} className="bg-arkin-secondary/70 text-gray-600 text-[10px] sm:text-xs border-0">
                              {caracteristica}
                            </Badge>
                          ))}
                          {propiedad.caracteristicas.length > 2 && (
                            <Badge className="bg-arkin-gold/10 text-arkin-gold text-[10px] sm:text-xs border-0">
                              +{propiedad.caracteristicas.length - 2} más
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          <Button className="flex-1 bg-arkin-gold hover:bg-arkin-gold/90 text-black rounded-xl text-sm">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                            Agendar Visita
                          </Button>
                          <Link href={`/propiedades/${propiedad.id}`} className="flex-1 sm:flex-initial">
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto px-4 border-gray-200 hover:border-arkin-gold hover:text-arkin-gold rounded-xl bg-transparent text-sm"
                            >
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredAndSortedProperties.map((propiedad) => (
                    <div
                      key={propiedad.id}
                      className="group bg-arkin-secondary/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-arkin-gold/20"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative md:w-80 h-64 md:h-48 overflow-hidden">
                          <img
                            src={propiedad.imagen || "/placeholder.svg"}
                            alt={propiedad.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge
                              className={`${propiedad.status === "Disponible"
                                ? "bg-green-500/90 text-white"
                                : propiedad.status === "Exclusiva"
                                  ? "bg-arkin-gold/90 text-black"
                                  : "bg-red-500/90 text-white"
                                } backdrop-blur-sm`}
                            >
                              {propiedad.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className="bg-arkin-secondary text-gray-700 text-xs">{propiedad.tipo}</Badge>
                                  <span className="text-2xl font-bold text-arkin-gold">{propiedad.precioTexto}</span>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 uppercase">{propiedad.titulo}</h3>
                                <div className="flex items-center text-gray-600 mb-3">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span className="text-sm">{propiedad.ubicacion}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
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
                                <Button size="sm" className="w-8 h-8 p-0 bg-arkin-secondary hover:bg-gray-200 text-gray-700 rounded-full">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 flex-1">{propiedad.descripcion}</p>

                            {/* Property Stats */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Bed className="h-4 w-4 mr-1" />
                                  <span>{propiedad.habitaciones} hab</span>
                                </div>
                                <div className="flex items-center">
                                  <Bath className="h-4 w-4 mr-1" />
                                  <span>{propiedad.banos} baños</span>
                                </div>
                                <div className="flex items-center">
                                  <Square className="h-4 w-4 mr-1" />
                                  <span>{propiedad.areaTexto}</span>
                                </div>
                              </div>

                              <div className="flex space-x-3">
                                <Button size="sm" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black rounded-xl">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Agendar
                                </Button>
                                <Link href={`/propiedades/${propiedad.id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-200 hover:border-arkin-gold hover:text-arkin-gold rounded-xl"
                                  >
                                    Ver Detalles
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Map View */}
              {viewMode === 'map' && (
                <div className="bg-arkin-secondary/50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="h-96 bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Map className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Vista de Mapa</h3>
                      <p>Mapa interactivo con ubicaciones de propiedades</p>
                      <p className="text-sm mt-2">Próximamente disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredAndSortedProperties.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
                  <p className="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
                  <Button
                    onClick={() => setFilters({})}
                    className="bg-arkin-gold hover:bg-arkin-gold/90 text-black"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            ¿Tienes una propiedad exclusiva?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a nuestro selecto portafolio de propiedades de lujo y accede a compradores exclusivos
          </p>
          <Link href="/propietarios">
            <Button className="bg-arkin-gold hover:bg-arkin-gold/90 text-black px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg">
              Registrar mi Propiedad
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Search Chat */}
      <AISearchChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        properties={filteredAndSortedProperties}
      />
    </div>
  )
}

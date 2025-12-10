"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Heart, 
  Share2,
  Phone,
  Mail,
  MessageCircle,
  Car,
  Wifi,
  Shield,
  TreePine,
  Waves,
  Dumbbell,
  ChefHat,
  Wind,
  Sun,
  Camera,
  Play,
  ArrowLeft,
  ArrowRight,
  Maximize,
  X,
  Star,
  Clock,
  Calculator,
  Loader2,
  Users
} from "lucide-react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import type { Propiedad } from "@/data/propiedades"

interface PropertyDetailClientProps {
  propertyData: Propiedad | null
  propertyId: string
}

export function PropertyDetailClient({ propertyData: initialData, propertyId }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [propertyData, setPropertyData] = useState<Propiedad | null>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Cargar propiedad directamente desde Supabase
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        
        const id = parseInt(propertyId, 10)
        if (isNaN(id)) {
          setLoadError('ID de propiedad inválido')
          setIsLoading(false)
          return
        }

        // Importar supabase dinámicamente para evitar problemas de SSR
        const { supabase } = await import('@/lib/supabase/client')
        
        // Cargar datos básicos
        const { data: prop, error } = await supabase
          .from('propiedades')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error cargando propiedad:', error)
          setLoadError('Error al cargar la propiedad')
          setIsLoading(false)
          return
        }

        if (!prop) {
          setLoadError('Propiedad no encontrada')
          setIsLoading(false)
          return
        }

        // Formatear datos
        const formattedProperty: Propiedad = {
          id: Number(prop.id),
          titulo: prop.titulo,
          ubicacion: prop.ubicacion,
          precio: Number(prop.precio),
          precioTexto: prop.precio_texto || `$${Number(prop.precio).toLocaleString('es-MX')}`,
          tipo: prop.tipo,
          habitaciones: prop.habitaciones || 0,
          banos: prop.banos || 0,
          area: prop.area || 0,
          areaTexto: prop.area_texto || `${prop.area || 0} m²`,
          imagen: prop.imagen || '/placeholder-property.jpg',
          descripcion: prop.descripcion || '',
          caracteristicas: prop.caracteristicas || [],
          status: prop.status || 'Disponible',
          categoria: prop.categoria || 'venta',
          fechaPublicacion: prop.fecha_publicacion,
          tourVirtual: prop.tour_virtual || undefined,
          galeria: prop.galeria || [],
          agente: {
            nombre: 'Asesor ARKIN',
            especialidad: 'Especialista en Propiedades',
            rating: 5.0,
            ventas: 0,
            telefono: '+52 1 477 475 6951',
            email: 'arkinselect@gmail.com',
          },
        }

        setPropertyData(formattedProperty)
        setIsLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setLoadError('Error inesperado')
        setIsLoading(false)
      }
    }

    loadProperty()
  }, [propertyId])
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-arkin-gold mx-auto mb-4" />
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }
  
  // Handle case when property is not found or error
  if (!propertyData || loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {loadError || 'Propiedad no encontrada'}
          </h1>
          <Link href="/propiedades">
            <Button>Volver a Propiedades</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Función para generar lugares cercanos basados en la ubicación
  const generarLugaresCercanos = (ubicacion: string) => {
    const ciudad = ubicacion.split(',').pop()?.trim() || ubicacion
    
    // Lugares genéricos basados en la zona
    const lugaresBase = [
      { tipo: "Supermercado", nombre: `Superama ${ciudad}`, distancia: "0.3 km" },
      { tipo: "Hospital", nombre: `Hospital General ${ciudad}`, distancia: "1.2 km" },
      { tipo: "Escuela", nombre: `Colegio ${ciudad}`, distancia: "0.8 km" },
      { tipo: "Parque", nombre: `Parque Central`, distancia: "0.5 km" },
      { tipo: "Centro Comercial", nombre: `Plaza ${ciudad}`, distancia: "1.0 km" }
    ]
    
    return lugaresBase
  }

  // Mapeo de amenidades con iconos
  const amenidadesIconMap: { [key: string]: any } = {
    "Seguridad 24/7": { icon: Shield, description: "Vigilancia y acceso controlado" },
    "Estacionamiento": { icon: Car, description: "Espacios de estacionamiento" },
    "Gimnasio": { icon: Dumbbell, description: "Área de ejercicio equipada" },
    "Alberca": { icon: Waves, description: "Piscina" },
    "Jardín": { icon: TreePine, description: "Áreas verdes" },
    "Internet": { icon: Wifi, description: "Conexión de alta velocidad" },
    "Terraza": { icon: Sun, description: "Área exterior" },
    "Spa": { icon: Wind, description: "Área de relajación" },
    "Roof Garden": { icon: TreePine, description: "Jardín en azotea" },
    "Área de Juegos": { icon: Users, description: "Espacio recreativo" },
  }

  // Generar amenidades desde los datos o usar defaults
  const getAmenidades = () => {
    const detalles = propertyData.detalles as any
    if (detalles?.amenidades && Array.isArray(detalles.amenidades)) {
      return detalles.amenidades.map((amenidad: string) => {
        const mapped = amenidadesIconMap[amenidad]
        return {
          icon: mapped?.icon || Shield,
          name: amenidad,
          description: mapped?.description || amenidad
        }
      })
    }
    // Amenidades por defecto si no hay datos
    return [
      { icon: Shield, name: "Seguridad 24/7", description: "Vigilancia y acceso controlado" },
      { icon: Car, name: "Estacionamiento", description: "Espacios de estacionamiento" },
    ]
  }

  // Transform data to match component structure
  const property = {
    id: propertyData.id,
    titulo: propertyData.titulo,
    ubicacion: propertyData.ubicacion,
    precio: propertyData.precio,
    tipo: propertyData.tipo,
    habitaciones: propertyData.habitaciones,
    banos: propertyData.banos,
    area: propertyData.area,
    areaTerreno: (propertyData.detalles as any)?.areaTerreno || 120,
    estacionamientos: (propertyData.detalles as any)?.estacionamientos || 2,
    antiguedad: propertyData.detalles?.antiguedad ? parseInt(propertyData.detalles.antiguedad) : 2,
    descripcion: propertyData.descripcion,
    caracteristicas: propertyData.caracteristicas,
    amenidades: getAmenidades(),
    imagenes: propertyData.galeria || [propertyData.imagen],
    agente: propertyData.agente || {
      nombre: "Agente ARKIN SELECT",
      especialidad: "Especialista en Propiedades",
      telefono: "+52 1 477 475 6951",
      email: "contacto@arkinselect.mx",
      rating: 4.8,
      ventas: 50
    },
    ubicacionInfo: {
      walkScore: Math.floor(Math.random() * 20) + 75,
      transitScore: Math.floor(Math.random() * 20) + 70,
      bikeScore: Math.floor(Math.random() * 20) + 65,
      cercanos: generarLugaresCercanos(propertyData.ubicacion)
    },
    status: propertyData.status,
    fechaPublicacion: propertyData.fechaPublicacion,
    vistas: propertyData.detalles?.vistas || 100,
    favoritos: propertyData.detalles?.favoritos || 10
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.imagenes.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.imagenes.length - 1 : prev - 1
    )
  }

  return (
    <div className="min-h-screen bg-arkin-secondary">
      {/* Fullscreen Image Modal */}
      {isImageFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsImageFullscreen(false)}
        >
          <button
            onClick={() => setIsImageFullscreen(false)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <img
            src={property.imagenes[currentImageIndex] || "/placeholder.svg"}
            alt={property.titulo}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/70 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {property.imagenes.length}
          </div>
        </div>
      )}
      {/* Hero Image Gallery */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src={property.imagenes[currentImageIndex] || "/placeholder.svg"}
            alt={property.titulo}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {property.imagenes.length}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <WishlistButton 
              property={{
                id: property.id.toString(),
                title: property.titulo,
                price: formatPrice(property.precio),
                location: property.ubicacion,
                image: property.imagenes[0],
                bedrooms: property.habitaciones,
                bathrooms: property.banos,
                area: `${property.area} m²`
              }}
              size="lg"
              className="bg-arkin-secondary/50/90 hover:bg-arkin-secondary/50"
            />
            <Button
              variant="ghost"
              size="sm"
              className="bg-arkin-secondary/50/90 hover:bg-arkin-secondary/50 text-gray-700 rounded-full w-12 h-12 p-0"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImageFullscreen(true)}
              className="bg-arkin-secondary/50/90 hover:bg-arkin-secondary/50 text-gray-700 rounded-full w-12 h-12 p-0"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>

          {/* Property Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
              {property.status}
            </Badge>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {property.imagenes.map((imagen, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex 
                    ? 'border-arkin-gold' 
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img
                  src={imagen || "/placeholder.svg"}
                  alt={`Vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-arkin-secondary/50 rounded-2xl p-4 sm:p-6 shadow-sm border border-arkin-primary/30">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-2">
                    {property.titulo}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base lg:text-lg">{property.ubicacion}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-arkin-gold mb-1">
                    {formatPrice(property.precio)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {formatPrice(Math.round(property.precio / property.area))} / m²
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 bg-arkin-secondary/50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-arkin-gold" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{property.habitaciones}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Habitaciones</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-arkin-gold" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{property.banos}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Baños</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Square className="h-4 w-4 sm:h-5 sm:w-5 text-arkin-gold" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-xs sm:text-sm text-gray-600">m² Construidos</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Car className="h-4 w-4 sm:h-5 sm:w-5 text-arkin-gold" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{property.estacionamientos}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Estacionamientos</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-arkin-gold" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{property.antiguedad}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Años</div>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="descripcion" className="bg-arkin-secondary/50 rounded-2xl shadow-sm border border-arkin-primary/30">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-arkin-secondary/50 rounded-t-2xl">
                <TabsTrigger value="descripcion" className="rounded-xl text-xs sm:text-sm px-1 sm:px-3">Descripción</TabsTrigger>
                <TabsTrigger value="caracteristicas" className="rounded-xl text-xs sm:text-sm px-1 sm:px-3">Características</TabsTrigger>
                <TabsTrigger value="amenidades" className="rounded-xl text-xs sm:text-sm px-1 sm:px-3">Amenidades</TabsTrigger>
                <TabsTrigger value="ubicacion" className="rounded-xl text-xs sm:text-sm px-1 sm:px-3">Ubicación</TabsTrigger>
              </TabsList>

              <TabsContent value="descripcion" className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {property.descripcion}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Detalles Generales</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tipo de propiedad:</span>
                          <span className="font-medium">{property.tipo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Área construida:</span>
                          <span className="font-medium">{property.area} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Área de terraza:</span>
                          <span className="font-medium">{property.areaTerreno} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Antigüedad:</span>
                          <span className="font-medium">{property.antiguedad} años</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Estadísticas</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vistas:</span>
                          <span className="font-medium">{property.vistas.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">En favoritos:</span>
                          <span className="font-medium">{property.favoritos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Publicado:</span>
                          <span className="font-medium">
                            {new Date(property.fechaPublicacion).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="caracteristicas" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.caracteristicas.map((caracteristica, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-arkin-secondary/30 rounded-lg">
                      <div className="w-2 h-2 bg-arkin-gold rounded-full"></div>
                      <span className="text-gray-700">{caracteristica}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenidades" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.amenidades.map((amenidad: { icon: any; name: string; description: string }, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-arkin-secondary/30 rounded-lg">
                      <div className="w-12 h-12 bg-arkin-gold/10 rounded-lg flex items-center justify-center">
                        <amenidad.icon className="h-6 w-6 text-arkin-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{amenidad.name}</h4>
                        <p className="text-sm text-gray-600">{amenidad.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ubicacion" className="p-6">
                <div className="space-y-6">
                  {/* Location Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-arkin-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-arkin-gold mb-1">
                        {property.ubicacionInfo.walkScore}
                      </div>
                      <div className="text-sm text-gray-600">Walk Score</div>
                      <div className="text-xs text-gray-500">Muy caminable</div>
                    </div>
                    <div className="text-center p-4 bg-arkin-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-arkin-gold mb-1">
                        {property.ubicacionInfo.transitScore}
                      </div>
                      <div className="text-sm text-gray-600">Transit Score</div>
                      <div className="text-xs text-gray-500">Excelente transporte</div>
                    </div>
                    <div className="text-center p-4 bg-arkin-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-arkin-gold mb-1">
                        {property.ubicacionInfo.bikeScore}
                      </div>
                      <div className="text-sm text-gray-600">Bike Score</div>
                      <div className="text-xs text-gray-500">Muy ciclable</div>
                    </div>
                  </div>

                  {/* Nearby Places */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Lugares Cercanos</h4>
                    <div className="space-y-3">
                      {property.ubicacionInfo.cercanos.map((lugar, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-arkin-secondary/30 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{lugar.nombre}</span>
                            <span className="text-sm text-gray-600 ml-2">({lugar.tipo})</span>
                          </div>
                          <span className="text-sm font-medium text-arkin-gold">{lugar.distancia}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ubicación Info */}
                  <div className="p-4 bg-arkin-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-arkin-gold" />
                      <span className="font-medium">{property.ubicacion}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Contacta al asesor para conocer la ubicación exacta de la propiedad.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Agent & Actions */}
          <div className="space-y-6">
            {/* Asesor Responsable Card */}
            <Card className="bg-arkin-secondary/50 border-arkin-primary/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-serif">Asesor Responsable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-arkin-gold text-black text-lg font-semibold">
                      {property.agente.nombre.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{property.agente.nombre}</h3>
                    <p className="text-sm text-gray-600">ARKIN SELECT</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Visit */}
            <Card className="bg-arkin-secondary/50 border-arkin-primary/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-serif">Agendar Visita</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-arkin-gold hover:bg-arkin-gold/90 text-black text-lg py-3">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Visita Privada
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Respuesta en menos de 2 horas
                </p>
              </CardContent>
            </Card>

            {/* Mortgage Calculator */}
            <Card className="bg-arkin-secondary/50 border-arkin-primary/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-serif">Calculadora de Crédito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-arkin-gold">
                    {formatPrice(property.precio * 0.2)}
                  </div>
                  <div className="text-sm text-gray-600">Enganche estimado (20%)</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatPrice(Math.round((property.precio * 0.8 * 0.01) / 12))}
                  </div>
                  <div className="text-sm text-gray-600">Pago mensual estimado</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-arkin-gold/20 hover:border-arkin-gold hover:bg-arkin-gold/5"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Crédito
                </Button>
              </CardContent>
            </Card>

                      </div>
        </div>
      </div>
    </div>
  )
}

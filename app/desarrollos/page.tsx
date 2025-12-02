"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Phone,
  TreePine,
  Building,
  Landmark,
  Car,
  Shield,
  Waves,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const desarrollosVerticales = [
  {
    id: 1,
    nombre: "Torre Arkin Polanco",
    ubicacion: "Polanco, CDMX",
    tipo: "Departamentos de Lujo",
    precioDesde: "$8,500,000",
    imagen: "/luxury-penthouse-polanco-main.png",
    unidades: 48,
    pisos: 25,
    amenidades: ["Roof Garden", "Gym", "Alberca", "Concierge 24/7"],
    entrega: "Diciembre 2025",
    avance: 75,
    destacado: true
  },
  {
    id: 2,
    nombre: "Residencial Altura",
    ubicacion: "Santa Fe, CDMX",
    tipo: "Departamentos",
    precioDesde: "$5,200,000",
    imagen: "/luxury-villa-santa-fe.png",
    unidades: 120,
    pisos: 18,
    amenidades: ["Business Center", "Gym", "Área de niños", "Pet Friendly"],
    entrega: "Marzo 2026",
    avance: 45,
    destacado: false
  },
  {
    id: 3,
    nombre: "Sky Lofts Condesa",
    ubicacion: "Condesa, CDMX",
    tipo: "Lofts",
    precioDesde: "$4,800,000",
    imagen: "/modern-apartment-roma-norte.png",
    unidades: 32,
    pisos: 12,
    amenidades: ["Terraza común", "Coworking", "Bicicletas compartidas"],
    entrega: "Junio 2025",
    avance: 90,
    destacado: true
  }
]

const desarrollosHorizontales = [
  {
    id: 4,
    nombre: "Residencial Los Encinos",
    ubicacion: "León, Guanajuato",
    tipo: "Casas Residenciales",
    precioDesde: "$3,500,000",
    imagen: "/luxury-modern-villa-with-infinity-pool-at-sunset-a.png",
    unidades: 85,
    terreno: "200-350 m²",
    amenidades: ["Casa Club", "Alberca", "Canchas deportivas", "Áreas verdes"],
    entrega: "Inmediata",
    avance: 100,
    destacado: true
  },
  {
    id: 5,
    nombre: "Villas del Bosque",
    ubicacion: "Querétaro, Querétaro",
    tipo: "Casas Premium",
    precioDesde: "$6,200,000",
    imagen: "/luxury-villa-santa-fe.png",
    unidades: 45,
    terreno: "400-600 m²",
    amenidades: ["Golf", "Spa", "Restaurante", "Seguridad 24/7"],
    entrega: "Septiembre 2025",
    avance: 60,
    destacado: false
  }
]

const fraccionamientos = [
  {
    id: 6,
    nombre: "Terranova Premium",
    ubicacion: "León, Guanajuato",
    tipo: "Lotes Residenciales",
    precioDesde: "$1,200,000",
    imagen: "/placeholder.jpg",
    lotes: 150,
    tamano: "150-300 m²",
    amenidades: ["Parque central", "Ciclovía", "Acceso controlado"],
    entrega: "Inmediata",
    avance: 100,
    destacado: true
  },
  {
    id: 7,
    nombre: "Hacienda Real",
    ubicacion: "Irapuato, Guanajuato",
    tipo: "Lotes Premium",
    precioDesde: "$850,000",
    imagen: "/placeholder.jpg",
    lotes: 200,
    tamano: "200-400 m²",
    amenidades: ["Lago artificial", "Áreas deportivas", "Comercios"],
    entrega: "Marzo 2025",
    avance: 80,
    destacado: false
  },
  {
    id: 8,
    nombre: "Bosques del Valle",
    ubicacion: "San Miguel de Allende, Guanajuato",
    tipo: "Lotes Campestres",
    precioDesde: "$2,500,000",
    imagen: "/placeholder.jpg",
    lotes: 60,
    tamano: "1,000-2,000 m²",
    amenidades: ["Viñedo", "Casa club", "Caballerizas", "Huertos"],
    entrega: "Junio 2025",
    avance: 40,
    destacado: true
  }
]

function DesarrolloCard({ desarrollo, tipo }: { desarrollo: any, tipo: string }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={desarrollo.imagen}
          alt={desarrollo.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {desarrollo.destacado && (
          <Badge className="absolute top-3 left-3 bg-arkin-gold text-black">
            Destacado
          </Badge>
        )}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {desarrollo.avance}% Avance
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{desarrollo.nombre}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="h-3 w-3" />
              {desarrollo.ubicacion}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {desarrollo.tipo}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-4 w-4 text-arkin-gold" />
            <span>{tipo === 'vertical' ? `${desarrollo.pisos} pisos` : tipo === 'horizontal' ? desarrollo.terreno : `${desarrollo.lotes} lotes`}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="h-4 w-4 text-arkin-gold" />
            <span>{desarrollo.unidades || desarrollo.lotes} unidades</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-arkin-gold" />
            <span>{desarrollo.entrega}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {desarrollo.amenidades.slice(0, 3).map((amenidad: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {amenidad}
            </Badge>
          ))}
          {desarrollo.amenidades.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{desarrollo.amenidades.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-xl font-bold text-arkin-gold">{desarrollo.precioDesde}</p>
          </div>
          <Button size="sm" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black">
            Ver más
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DesarrollosPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-arkin-dark to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-arkin-gold/20 text-arkin-gold border-arkin-gold/30 mb-6">
              Nuevos Proyectos
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Desarrollos Inmobiliarios
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Descubre los mejores desarrollos verticales, horizontales y fraccionamientos. 
              Invierte en proyectos con alto potencial de plusvalía.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black">
                <Building2 className="mr-2 h-5 w-5" />
                Ver Desarrollos
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Contactar Asesor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-200/50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-arkin-gold">15+</p>
              <p className="text-gray-600">Desarrollos Activos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-arkin-gold">500+</p>
              <p className="text-gray-600">Unidades Disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-arkin-gold">8</p>
              <p className="text-gray-600">Ciudades</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-arkin-gold">25%</p>
              <p className="text-gray-600">Plusvalía Promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de Desarrollos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="verticales" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-xl">
                <TabsTrigger value="verticales" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Verticales</span>
                </TabsTrigger>
                <TabsTrigger value="horizontales" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Horizontales</span>
                </TabsTrigger>
                <TabsTrigger value="fraccionamientos" className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Fraccionamientos</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="verticales">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Desarrollos Verticales</h2>
                <p className="text-gray-600">Torres de departamentos y edificios residenciales de lujo.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {desarrollosVerticales.map((desarrollo) => (
                  <DesarrolloCard key={desarrollo.id} desarrollo={desarrollo} tipo="vertical" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="horizontales">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Desarrollos Horizontales</h2>
                <p className="text-gray-600">Residenciales de casas con amenidades exclusivas.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {desarrollosHorizontales.map((desarrollo) => (
                  <DesarrolloCard key={desarrollo.id} desarrollo={desarrollo} tipo="horizontal" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fraccionamientos">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Fraccionamientos</h2>
                <p className="text-gray-600">Lotes residenciales y campestres para construir tu hogar ideal.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fraccionamientos.map((desarrollo) => (
                  <DesarrolloCard key={desarrollo.id} desarrollo={desarrollo} tipo="fraccionamiento" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué invertir en desarrollos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los desarrollos inmobiliarios ofrecen ventajas únicas para inversionistas y compradores.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Alta Plusvalía</h3>
              <p className="text-gray-600 text-sm">
                Compra en preventa y obtén hasta 30% de plusvalía al momento de la entrega.
              </p>
            </Card>
            
            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Seguridad Jurídica</h3>
              <p className="text-gray-600 text-sm">
                Todos los desarrollos cuentan con permisos y documentación en regla.
              </p>
            </Card>
            
            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Amenidades Premium</h3>
              <p className="text-gray-600 text-sm">
                Disfruta de instalaciones de primer nivel incluidas en tu inversión.
              </p>
            </Card>
            
            <Card className="border-0 shadow-lg text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ubicaciones Estratégicas</h3>
              <p className="text-gray-600 text-sm">
                Desarrollos en zonas con alta demanda y excelente conectividad.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-arkin-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Interesado en algún desarrollo?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Nuestros asesores especializados te ayudarán a encontrar la mejor opción 
            de inversión según tus objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button size="lg" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black">
                Agendar Cita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://wa.me/524774756951">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

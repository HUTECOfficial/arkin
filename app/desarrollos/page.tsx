"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2,
  Home, 
  Phone,
  Building,
  Landmark,
  Car,
  Shield,
  Waves,
  TrendingUp,
  Map,
  Clock,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Leon3DMap = dynamic(() => import("@/components/leon-3d-map").then(mod => mod.Leon3DMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] lg:h-[600px] bg-[#080b14] rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-arkin-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Cargando mapa interactivo 3D...</p>
      </div>
    </div>
  )
})

function ProximamenteSection({ titulo, descripcion, icono }: { titulo: string, descripcion: string, icono: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-arkin-gold/10 rounded-full flex items-center justify-center mb-6">
        {icono}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{titulo}</h2>
      <p className="text-gray-500 mb-6 max-w-md">{descripcion}</p>
      <div className="flex items-center gap-2 bg-arkin-gold/10 border border-arkin-gold/30 rounded-full px-6 py-3">
        <Clock className="h-4 w-4 text-arkin-gold" />
        <span className="text-arkin-gold font-semibold text-sm">Próximamente</span>
      </div>
      <p className="text-gray-400 text-sm mt-4">Estamos preparando proyectos exclusivos para esta categoría.</p>
    </div>
  )
}

export default function DesarrollosPage() {
  return (
    <div className="min-h-screen bg-arkin-secondary">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-arkin-dark to-gray-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('https://mnrfsdrjadretxesjxhu.supabase.co/storage/v1/object/sign/arkin/hf_20260219_015208_b75495b2-1016-45df-a1f8-d1160006831b.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTg2NjJkMS1lZjIzLTRkZjUtYjAwYy04NjVkOTcwYzljZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmtpbi9oZl8yMDI2MDIxOV8wMTUyMDhfYjc1NDk1YjItMTAxNi00NWRmLWExZjgtZDExNjAwMDY4MzFiLmpwZWciLCJpYXQiOjE3NzE0NjYyNTQsImV4cCI6MTgwMzAwMjI1NH0.0ew5z0WbvUkHQAwo8zOlhQFyLokmh2PKTqjqBtpxcuc')" }}
        />
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
              <Button size="lg" variant="outline" className="border-arkin-accent text-arkin-accent hover:bg-arkin-accent/10">
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

      {/* Mapa 3D de León */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-arkin-gold/20 text-arkin-gold border-arkin-gold/30 mb-4">
              <Map className="h-3 w-3 mr-1" />
              Mapa Interactivo
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-3">
              Desarrollos en León, Guanajuato
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explora nuestros desarrollos por zona. Pasa el cursor o haz clic en un edificio para ver disponibilidad y precios.
            </p>
          </div>
          <Leon3DMap />
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
              <ProximamenteSection
                titulo="Desarrollos Verticales"
                descripcion="Torres de departamentos y edificios residenciales de lujo"
                icono={<Building className="h-12 w-12 text-arkin-gold" />}
              />
            </TabsContent>

            <TabsContent value="horizontales">
              <ProximamenteSection
                titulo="Desarrollos Horizontales"
                descripcion="Residenciales de casas con amenidades exclusivas"
                icono={<Home className="h-12 w-12 text-arkin-gold" />}
              />
            </TabsContent>

            <TabsContent value="fraccionamientos">
              <ProximamenteSection
                titulo="Fraccionamientos"
                descripcion="Lotes residenciales y campestres para construir tu hogar ideal"
                icono={<Landmark className="h-12 w-12 text-arkin-gold" />}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-arkin-secondary/70">
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
              <Button size="lg" variant="outline" className="border-arkin-accent text-arkin-accent hover:bg-arkin-accent/10">
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

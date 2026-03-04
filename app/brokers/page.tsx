"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Phone, 
  MapPin,
  Scale
} from "lucide-react"

const notariasAsociadas = [
  {
    nombre: "Notaría 100",
    notario: "Lic. Jorge Arturo Zepeda Orozco",
    especialidad: "Escrituración y Compraventa",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 475 6951"
  },
  {
    nombre: "Notaría 65",
    notario: "Lic. Pablo Francisco Toriello Arce",
    especialidad: "Compraventa y Fideicomisos",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 475 6951"
  },
  {
    nombre: "Notaría 98",
    notario: "Lic. Jose Manuel Toriello Arce",
    especialidad: "Desarrollos Inmobiliarios",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 475 6951"
  },
  {
    nombre: "Notaría 15",
    notario: "Lic. Cesar Santos del Muro Amador",
    especialidad: "Hipotecas y Escrituración",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 475 6951"
  },
  {
    nombre: "Notaría 82",
    notario: "Lic. Enrique Duran Llamas",
    especialidad: "Compraventa Inmobiliaria",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 475 6951"
  }
]

export default function BrokersPage() {
  return (
    <div className="min-h-screen bg-arkin-secondary">
      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-stretch overflow-hidden">
        {/* Panel izquierdo: contenido de texto */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 bg-arkin-dark px-10 py-16 lg:px-16">
          {/* Acento decorativo gold */}
          <div className="absolute top-0 left-0 w-1 h-full bg-arkin-gold" />
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-arkin-gold/5 blur-3xl pointer-events-none" />

          <Badge className="self-start bg-arkin-gold/15 text-arkin-gold border-arkin-gold/40 mb-5 text-xs tracking-widest uppercase">
            Red de Profesionales
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Brokers<br />
            <span className="text-arkin-gold">&amp; Notarías</span>
          </h1>

          <p className="text-gray-300 text-base max-w-md mb-8 leading-relaxed">
            Red consolidada de brokers y notarías de confianza que garantizan 
            seguridad jurídica en cada operación inmobiliaria.
          </p>

          {/* Stats rápidos */}
          <div className="flex gap-8 mb-8">
            <div>
              <p className="text-2xl font-bold text-arkin-gold">5+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Notarías</p>
            </div>
            <div className="w-px bg-arkin-gold/20" />
            <div>
              <p className="text-2xl font-bold text-arkin-gold">100%</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Confiables</p>
            </div>
            <div className="w-px bg-arkin-gold/20" />
            <div>
              <p className="text-2xl font-bold text-arkin-gold">León</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Guanajuato</p>
            </div>
          </div>

          <Button size="lg" className="self-start bg-arkin-gold hover:bg-arkin-gold/90 text-black font-bold">
            <Scale className="mr-2 h-5 w-5" />
            Directorio de Notarías
          </Button>
        </div>

        {/* Panel derecho: imagen */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://mnrfsdrjadretxesjxhu.supabase.co/storage/v1/object/sign/arkin/hf_20260219_015208_b75495b2-1016-45df-a1f8-d1160006831b.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTg2NjJkMS1lZjIzLTRkZjUtYjAwYy04NjVkOTcwYzljZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmtpbi9oZl8yMDI2MDIxOV8wMTUyMDhfYjc1NDk1YjItMTAxNi00NWRmLWExZjgtZDExNjAwMDY4MzFiLmpwZWciLCJpYXQiOjE3NzE0NjYyNTQsImV4cCI6MTgwMzAwMjI1NH0.0ew5z0WbvUkHQAwo8zOlhQFyLokmh2PKTqjqBtpxcuc')" }}
          />
          {/* Degradado de transición izq→der */}
          <div className="absolute inset-0 bg-gradient-to-r from-arkin-dark via-arkin-dark/30 to-transparent" />
          {/* Overlay gold sutil */}
          <div className="absolute inset-0 bg-arkin-gold/5" />
        </div>
      </section>

      {/* Notarías Asociadas */}
      <section className="py-20 bg-arkin-secondary/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notarías Asociadas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trabajamos con notarías de confianza que garantizan seguridad jurídica 
              en todas las transacciones inmobiliarias.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notariasAsociadas.map((notaria, index) => (
              <Card key={index} className="border border-arkin-primary/30 bg-arkin-secondary/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Scale className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{notaria.nombre}</CardTitle>
                      <p className="text-sm text-gray-500">{notaria.notario}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{notaria.especialidad}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{notaria.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{notaria.telefono}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

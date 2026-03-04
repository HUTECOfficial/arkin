"use client"

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
      <section className="relative overflow-hidden min-h-[320px] sm:min-h-[420px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://mnrfsdrjadretxesjxhu.supabase.co/storage/v1/object/sign/arkin/hf_20260219_015208_b75495b2-1016-45df-a1f8-d1160006831b.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTg2NjJkMS1lZjIzLTRkZjUtYjAwYy04NjVkOTcwYzljZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmtpbi9oZl8yMDI2MDIxOV8wMTUyMDhfYjc1NDk1YjItMTAxNi00NWRmLWExZjgtZDExNjAwMDY4MzFiLmpwZWciLCJpYXQiOjE3NzE0NjYyNTQsImV4cCI6MTgwMzAwMjI1NH0.0ew5z0WbvUkHQAwo8zOlhQFyLokmh2PKTqjqBtpxcuc')" }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 flex items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-arkin-gold rounded-2xl flex items-center justify-center shadow-lg">
                <Scale className="h-6 w-6 text-black" />
              </div>
              <span className="text-arkin-gold text-sm font-semibold uppercase tracking-widest">Arkin Select</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
              Brokers<br/>
              <span className="text-arkin-gold">&amp; Notarías</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed">
              Red consolidada de brokers y notarías de confianza que garantizan
              seguridad jurídica en cada operación inmobiliaria.
            </p>
            <Badge className="bg-arkin-gold text-black border-0 px-4 py-2 text-sm font-semibold shadow-lg">
              5 Notarías Asociadas
            </Badge>
          </div>
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

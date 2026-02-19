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
      <section className="relative py-20 bg-gradient-to-r from-arkin-dark to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-arkin-gold/20 text-arkin-gold border-arkin-gold/30 mb-6">
              Red de Profesionales
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Brokers y Notarías
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Contamos con una red consolidada de brokers y notarías de confianza 
              que garantizan el mejor servicio en cada operación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-arkin-accent text-arkin-accent hover:bg-arkin-accent/10">
                <Scale className="mr-2 h-5 w-5" />
                Directorio de Notarías
              </Button>
            </div>
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

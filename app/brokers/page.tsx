"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  FileText, 
  Shield, 
  Handshake, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Scale,
  Home,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const beneficios = [
  {
    icon: TrendingUp,
    titulo: "Comisiones Competitivas",
    descripcion: "Esquema de comisiones atractivo para brokers asociados con pagos puntuales."
  },
  {
    icon: Home,
    titulo: "Inventario Exclusivo",
    descripcion: "Acceso a propiedades premium y exclusivas no disponibles en el mercado abierto."
  },
  {
    icon: Users,
    titulo: "Red de Contactos",
    descripcion: "Conexión con una amplia red de compradores calificados e inversionistas."
  },
  {
    icon: Shield,
    titulo: "Respaldo Legal",
    descripcion: "Asesoría legal completa y documentación profesional en cada operación."
  },
  {
    icon: Briefcase,
    titulo: "Capacitación Continua",
    descripcion: "Programas de formación y actualización en el mercado inmobiliario."
  },
  {
    icon: Handshake,
    titulo: "Alianzas Estratégicas",
    descripcion: "Colaboración con notarías, bancos y desarrolladores de confianza."
  }
]

const notariasAsociadas = [
  {
    nombre: "Notaría 15 de León",
    notario: "Lic. Roberto Hernández García",
    especialidad: "Escrituración y Fideicomisos",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 123 4567"
  },
  {
    nombre: "Notaría 28 de León",
    notario: "Lic. María Elena Rodríguez",
    especialidad: "Compraventa y Hipotecas",
    ubicacion: "León, Guanajuato",
    telefono: "+52 477 234 5678"
  },
  {
    nombre: "Notaría 5 de Guadalajara",
    notario: "Lic. Carlos Martínez López",
    especialidad: "Desarrollos Inmobiliarios",
    ubicacion: "Guadalajara, Jalisco",
    telefono: "+52 33 345 6789"
  }
]

export default function BrokersPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    experiencia: "",
    mensaje: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData)
    alert("¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.")
  }

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
              Únete a nuestra red de profesionales inmobiliarios. Colaboramos con brokers 
              independientes y notarías para ofrecer el mejor servicio a nuestros clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black">
                <Handshake className="mr-2 h-5 w-5" />
                Únete como Broker
              </Button>
              <Button size="lg" variant="outline" className="border-arkin-accent text-arkin-accent hover:bg-arkin-accent/10">
                <Scale className="mr-2 h-5 w-5" />
                Directorio de Notarías
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beneficios de ser Broker Asociado
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Forma parte de ARKIN SELECT y accede a herramientas, recursos y oportunidades 
              exclusivas para hacer crecer tu negocio inmobiliario.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((beneficio, index) => (
              <Card key={index} className="border border-arkin-primary/30 bg-arkin-secondary/50 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-arkin-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <beneficio.icon className="h-6 w-6 text-arkin-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {beneficio.titulo}
                  </h3>
                  <p className="text-gray-600">
                    {beneficio.descripcion}
                  </p>
                </CardContent>
              </Card>
            ))}
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

      {/* Formulario de Registro */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Quieres ser Broker Asociado?
              </h2>
              <p className="text-gray-600">
                Completa el formulario y nos pondremos en contacto contigo para 
                discutir las oportunidades de colaboración.
              </p>
            </div>
            
            <Card className="border border-arkin-primary/30 bg-arkin-secondary/50 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <Input
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa / Inmobiliaria
                      </label>
                      <Input
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        placeholder="+52 477 123 4567"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Años de Experiencia
                    </label>
                    <Input
                      value={formData.experiencia}
                      onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
                      placeholder="Ej: 5 años"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <Textarea
                      value={formData.mensaje}
                      onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                      placeholder="Cuéntanos sobre tu experiencia y por qué te gustaría colaborar con nosotros..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-arkin-gold hover:bg-arkin-gold/90 text-black">
                    Enviar Solicitud
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

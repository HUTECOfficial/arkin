"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Lock, Shield, Phone, Mail } from "lucide-react"
import { usePropertiesStatic } from "@/hooks/use-properties-static"

export default function ExclusivosPage() {
  // Hook optimizado - carga instantánea desde JSON + realtime
  const { properties } = usePropertiesStatic()
  const propiedades = useMemo(() => 
    properties.filter(p => p.categoria === 'exclusivo'), 
    [properties]
  )

  const handleContacto = (ubicacion: string) => {
    const mensaje = `Hola, estoy interesado en una propiedad exclusiva en ${ubicacion}. Me gustaría recibir más información.`
    const whatsappUrl = `https://wa.me/5214774756951?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-arkin-secondary transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-0 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-arkin-accent/90 via-arkin-accent/70 to-transparent"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/propiedades-hero-background.png')",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-arkin-primary rounded-full mb-6">
            <Shield className="h-8 w-8 text-arkin-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 text-balance px-4">
            Propiedades
            <span className="block text-arkin-primary">Exclusivas</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto text-pretty px-4">
            Propiedades de máxima privacidad. Por discreción, solo mostramos ubicaciones generales
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Badge className="bg-arkin-primary/20 text-arkin-primary border-arkin-primary/30 px-4 py-2 text-sm">
              {propiedades.length} Propiedades Disponibles
            </Badge>
            <Badge className="bg-arkin-secondary/50/20 text-white border-white/30 px-4 py-2 text-sm flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Información Protegida
            </Badge>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-arkin-primary/10 to-arkin-primary/5 border border-arkin-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-arkin-primary" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-arkin-accent mb-2">
                  Protección de Privacidad
                </h3>
                <p className="text-arkin-accent/70 text-sm leading-relaxed">
                  Estas propiedades pertenecen a clientes que requieren máxima discreción. Por respeto a su privacidad, 
                  solo mostramos la ubicación general. Para obtener información completa, fotos y detalles específicos, 
                  contáctanos directamente. Verificaremos tu perfil antes de compartir información sensible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid - Solo Ubicación */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((propiedad) => (
              <div
                key={propiedad.id}
                className="group bg-arkin-secondary/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-arkin-primary/20"
              >
                {/* Blurred Image with Lock */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-arkin-accent/10 to-arkin-accent/5">
                  <img
                    src={propiedad.imagen || "/placeholder.svg"}
                    alt="Propiedad exclusiva"
                    className="w-full h-full object-cover blur-2xl opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-arkin-primary rounded-full mb-3">
                        <Lock className="h-8 w-8 text-arkin-accent" />
                      </div>
                      <p className="text-arkin-accent font-semibold">Información Protegida</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-arkin-primary/90 text-arkin-accent backdrop-blur-sm text-xs">
                      Exclusiva
                    </Badge>
                  </div>
                </div>

                {/* Content - Solo Ubicación */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-arkin-accent/10 text-arkin-accent text-xs">{propiedad.tipo}</Badge>
                    <Badge className="bg-arkin-primary/10 text-arkin-primary text-xs flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Privada
                    </Badge>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-arkin-accent mb-4">
                    Propiedad Exclusiva
                  </h3>

                  {/* Solo Ubicación Visible */}
                  <div className="bg-arkin-primary/5 border border-arkin-primary/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center text-arkin-accent mb-2">
                      <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-arkin-primary" />
                      <span className="text-base font-semibold">{propiedad.ubicacion}</span>
                    </div>
                    <p className="text-arkin-accent/60 text-xs ml-7">
                      Ubicación general por privacidad del propietario
                    </p>
                  </div>

                  {/* Información Oculta */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm text-arkin-accent/40">
                      <span>Precio:</span>
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Confidencial
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-arkin-accent/40">
                      <span>Detalles:</span>
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Bajo solicitud
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-arkin-accent/40">
                      <span>Fotografías:</span>
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Previa verificación
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleContacto(propiedad.ubicacion)}
                    className="w-full bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent rounded-xl font-semibold"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Solicitar Información
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {propiedades.length === 0 && (
            <div className="text-center py-16">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-arkin-accent mb-2">No hay propiedades exclusivas disponibles</h3>
              <p className="text-arkin-accent/60 mb-6">Vuelve pronto para ver nuevas propiedades</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-arkin-accent via-black to-arkin-accent">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-12 w-12 mx-auto mb-6 text-arkin-primary" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Máxima Discreción Garantizada
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contáctanos para recibir información completa de estas propiedades exclusivas. 
            Verificamos cada solicitud para proteger la privacidad de nuestros clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.open('https://wa.me/5214774756951', '_blank')}
              className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
            <Button 
              onClick={() => window.location.href = 'mailto:arkinselect@gmail.com'}
              variant="outline"
              className="border-arkin-primary text-arkin-primary hover:bg-arkin-primary hover:text-arkin-accent px-8 py-4 text-lg font-semibold rounded-2xl"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

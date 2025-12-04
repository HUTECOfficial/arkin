'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Calendar, Zap } from "lucide-react"

export function ContactoYellow() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipo: '',
    mensaje: ''
  })

  return (
    <div className="min-h-screen bg-arkin-secondary relative overflow-hidden">
      {/* Geometric Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-arkin-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-arkin-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Bold */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-arkin-accent/5 border-2 border-arkin-primary rounded-full mb-8">
            <Zap className="h-5 w-5 text-arkin-primary" />
            <span className="text-sm font-bold text-arkin-accent uppercase tracking-wider">
              Respuesta Inmediata
            </span>
          </div>
          
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-black text-arkin-accent mb-6">
            HABLEMOS
          </h1>
          
          <p className="text-2xl text-arkin-accent/70 max-w-3xl mx-auto">
            Tu próxima gran decisión inmobiliaria comienza aquí
          </p>
        </div>
      </section>

      {/* Main Content - Split Screen */}
      <section className="relative py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl font-black text-arkin-accent mb-4">
                  ENVÍA TU MENSAJE
                </h2>
                <div className="w-20 h-1 bg-arkin-primary rounded-full" />
              </div>

              <Card className="p-8 bg-arkin-secondary/80 border-2 border-arkin-accent/10 rounded-3xl shadow-2xl">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-arkin-accent uppercase tracking-wide">
                        Nombre
                      </label>
                      <Input 
                        className="rounded-xl border-2 border-arkin-accent/20 focus:border-arkin-primary bg-arkin-secondary h-12 font-medium"
                        placeholder="Juan"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-arkin-accent uppercase tracking-wide">
                        Apellido
                      </label>
                      <Input 
                        className="rounded-xl border-2 border-arkin-accent/20 focus:border-arkin-primary bg-arkin-secondary h-12 font-medium"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-arkin-accent uppercase tracking-wide">
                      Email
                    </label>
                    <Input 
                      type="email"
                      className="rounded-xl border-2 border-arkin-accent/20 focus:border-arkin-primary bg-arkin-secondary h-12 font-medium"
                      placeholder="juan@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-arkin-accent uppercase tracking-wide">
                      Teléfono
                    </label>
                    <Input 
                      type="tel"
                      className="rounded-xl border-2 border-arkin-accent/20 focus:border-arkin-primary bg-arkin-secondary h-12 font-medium"
                      placeholder="+52 477 123 4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-arkin-accent uppercase tracking-wide">
                      Tipo de Consulta
                    </label>
                    <select className="w-full px-4 h-12 rounded-xl border-2 border-arkin-accent/20 focus:border-arkin-primary focus:outline-none bg-arkin-secondary font-medium text-arkin-accent">
                      <option>Vender mi propiedad</option>
                      <option>Comprar propiedad</option>
                      <option>Consulta general</option>
                      <option>Información sobre servicios</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-arkin-accent uppercase tracking-wide">
                      Mensaje
                    </label>
                    <Textarea 
                      rows={5}
                      className="rounded-xl border-2 border-arkin-accent/20 focus:border-arkin-primary bg-arkin-secondary resize-none font-medium"
                      placeholder="Cuéntanos sobre tu propiedad o consulta..."
                    />
                  </div>

                  <Button className="w-full bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-black py-6 rounded-xl text-lg shadow-xl hover:scale-105 transition-all duration-300">
                    <Send className="h-5 w-5 mr-2" />
                    ENVIAR MENSAJE
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right - Contact Info Cards */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-4xl font-black text-arkin-accent mb-4">
                  CONTÁCTANOS
                </h2>
                <div className="w-20 h-1 bg-arkin-primary rounded-full" />
              </div>

              {/* Contact Cards */}
              <div className="grid gap-6">
                <Card className="p-6 bg-arkin-accent border-0 rounded-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-arkin-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="h-7 w-7 text-arkin-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-arkin-secondary text-lg mb-2">OFICINA PRINCIPAL</h3>
                      <p className="text-arkin-secondary/80">
                        León, Guanajuato<br />
                        México
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-arkin-accent border-0 rounded-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-arkin-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="h-7 w-7 text-arkin-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-arkin-secondary text-lg mb-2">TELÉFONO</h3>
                      <p className="text-arkin-secondary/80">+52 1 477 475 6951</p>
                      <p className="text-arkin-secondary/60 text-sm mt-1">WhatsApp disponible</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-arkin-accent border-0 rounded-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-arkin-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="h-7 w-7 text-arkin-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-arkin-secondary text-lg mb-2">EMAIL</h3>
                      <p className="text-arkin-secondary/80">arkinselect@gmail.com</p>
                      <p className="text-arkin-secondary/60 text-sm mt-1">Respuesta en 24h</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-arkin-accent border-0 rounded-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-arkin-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock className="h-7 w-7 text-arkin-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-arkin-secondary text-lg mb-2">HORARIO</h3>
                      <p className="text-arkin-secondary/80">
                        Lun - Vie: 9:00 - 19:00<br />
                        Sábados: 10:00 - 14:00
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* CTA Card */}
              <Card className="p-8 bg-gradient-to-br from-arkin-primary to-arkin-primary/80 border-0 rounded-3xl shadow-2xl">
                <div className="text-center space-y-4">
                  <Calendar className="h-12 w-12 text-arkin-accent mx-auto" />
                  <h3 className="font-serif text-2xl font-black text-arkin-accent">
                    ¿LISTO PARA VENDER?
                  </h3>
                  <p className="text-arkin-accent/80">
                    Agenda una consulta gratuita y maximiza el valor de tu propiedad
                  </p>
                  <Button className="w-full bg-arkin-accent hover:bg-arkin-accent/90 text-arkin-primary font-bold py-6 rounded-xl">
                    <Calendar className="h-5 w-5 mr-2" />
                    AGENDAR CONSULTA
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Video, Play, ExternalLink, MapPin, Home, Building2, TreePine } from "lucide-react"
import Link from "next/link"

const virtualTours = [
  {
    id: 1,
    title: "Villa Moderna en Lomas",
    type: "Casa",
    location: "Lomas de Chapultepec, CDMX",
    thumbnail: "/luxury-modern-villa-with-infinity-pool-at-sunset-a.png",
    tourUrl: "#tour-1",
    duration: "5:30",
    icon: Home,
  },
  {
    id: 2,
    title: "Penthouse Exclusivo",
    type: "Departamento",
    location: "Polanco, CDMX",
    thumbnail: "/placeholder.svg",
    tourUrl: "#tour-2",
    duration: "4:15",
    icon: Building2,
  },
  {
    id: 3,
    title: "Terreno Premium",
    type: "Terreno",
    location: "Valle de Bravo",
    thumbnail: "/placeholder.svg",
    tourUrl: "#tour-3",
    duration: "3:45",
    icon: TreePine,
  },
]

export function VirtualToursSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-arkin-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-arkin-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-arkin-primary/10 border border-arkin-primary/20 rounded-full">
            <Video className="h-5 w-5 text-arkin-primary" />
            <span className="text-sm font-bold text-arkin-accent uppercase tracking-wider">
              Experiencia Inmersiva
            </span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-arkin-accent">
            Tours Virtuales <span className="text-arkin-primary">360°</span>
          </h2>
          
          <p className="text-xl text-arkin-accent/70 max-w-2xl mx-auto">
            Explora nuestras propiedades desde la comodidad de tu hogar con tecnología de realidad virtual
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {virtualTours.map((tour) => {
            const Icon = tour.icon
            return (
              <Card
                key={tour.id}
                className="group relative overflow-hidden rounded-3xl border-2 border-arkin-accent/10 hover:border-arkin-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-arkin-primary/20 cursor-pointer"
                onMouseEnter={() => setHoveredId(tour.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail */}
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${tour.thumbnail})` }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-arkin-accent via-arkin-accent/40 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 bg-arkin-primary rounded-full flex items-center justify-center transition-all duration-500 ${
                      hoveredId === tour.id ? 'scale-110' : 'scale-100'
                    }`}>
                      <Play className="h-10 w-10 text-arkin-accent ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-arkin-accent/80 backdrop-blur-sm text-arkin-secondary px-3 py-1 rounded-full text-sm font-bold">
                    {tour.duration}
                  </div>

                  {/* Type Icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-arkin-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-arkin-accent" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-arkin-secondary/80 backdrop-blur-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-arkin-primary uppercase tracking-wider">
                        {tour.type}
                      </span>
                      <ExternalLink className="h-4 w-4 text-arkin-accent/60 group-hover:text-arkin-primary transition-colors" />
                    </div>

                    <h3 className="font-serif text-xl font-bold text-arkin-accent group-hover:text-arkin-primary transition-colors">
                      {tour.title}
                    </h3>

                    <div className="flex items-center gap-2 text-arkin-accent/70">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{tour.location}</span>
                    </div>

                    <Button 
                      className="w-full bg-arkin-accent hover:bg-arkin-accent/90 text-arkin-secondary font-bold py-6 rounded-xl transition-all duration-300 group-hover:bg-arkin-primary group-hover:text-arkin-accent"
                      onClick={() => window.open(tour.tourUrl, '_blank')}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Iniciar Tour Virtual
                    </Button>
                  </div>
                </div>

                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 border-arkin-primary transition-opacity duration-500 pointer-events-none ${
                  hoveredId === tour.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/propiedades">
            <Button className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-bold px-10 py-6 rounded-2xl text-lg shadow-xl hover:scale-105 transition-all duration-300">
              Ver Todas las Propiedades
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

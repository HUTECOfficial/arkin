'use client'

import { useState, useEffect, useRef } from 'react'
import { Building2, Key, Shield, Sparkles } from "lucide-react"

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  delay: number
  gradient: string
}

function FeatureCard({ icon: Icon, title, description, delay, gradient }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        animation: isVisible ? `slideUp 0.8s ease-out ${delay}ms both` : 'none'
      }}
    >
      <div className="relative h-full p-8 rounded-3xl bg-arkin-secondary/30 backdrop-blur-sm border-2 border-arkin-accent/10 hover:border-arkin-primary transition-all duration-500 hover:shadow-2xl hover:shadow-arkin-primary/20 overflow-hidden">
        {/* Gradient Background */}
        <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Decorative Circle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-arkin-primary/5 rounded-full blur-2xl group-hover:bg-arkin-primary/10 transition-all duration-500" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Icon Container */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-arkin-primary to-arkin-primary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-arkin-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Icon className="h-10 w-10 text-arkin-accent" strokeWidth={2.5} />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-20 h-20 bg-arkin-primary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-arkin-accent group-hover:text-arkin-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-arkin-accent/70 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-arkin-primary/20 via-transparent to-arkin-primary/20 animate-pulse-slow" />
        </div>
      </div>
    </div>
  )
}

export function AnimatedStats() {
  const features = [
    { 
      icon: Building2, 
      title: 'Transparencia Total', 
      description: 'Información clara y completa de cada propiedad para tu tranquilidad y confianza',
      delay: 0,
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-500'
    },
    { 
      icon: Key, 
      title: 'Acceso Inmediato', 
      description: 'Visitas programadas en 24 horas y proceso de compra ágil y transparente',
      delay: 100,
      gradient: 'bg-gradient-to-br from-arkin-primary to-yellow-500'
    },
    { 
      icon: Shield, 
      title: 'Confianza Total', 
      description: 'Asesoría legal completa y garantía en cada transacción inmobiliaria',
      delay: 200,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    { 
      icon: Sparkles, 
      title: 'Experiencia Única', 
      description: 'Atención personalizada y servicio de lujo en cada etapa del proceso',
      delay: 300,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
  ]

  return (
    <>
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-arkin-accent/3 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

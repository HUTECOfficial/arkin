'use client'

import { useState, useEffect } from 'react'
import { Shield, Star, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export function WhyArkinCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const features = [
    {
      icon: Shield,
      title: "Confianza Total",
      desc: "Proceso transparente y directo. Sin letra pequeña.",
    },
    {
      icon: Star,
      title: "Exclusividad",
      desc: "Acceso a propiedades únicas y premium.",
    },
    {
      icon: Users,
      title: "Red Selecta",
      desc: "Conexión directa.",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, features.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentFeature = features[currentIndex]
  const Icon = currentFeature.icon

  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 bg-arkin-accent/3">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-arkin-accent mb-4">
            ¿Por qué ARKIN SELECT?
          </h2>
          <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-arkin-primary mx-auto rounded-full"></div>
        </div>

        <div className="relative group">
          <Card className="p-8 sm:p-12 bg-arkin-secondary border-2 border-arkin-accent/10 rounded-3xl shadow-2xl transition-all duration-500">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-arkin-primary rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500">
                <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-arkin-accent" />
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-arkin-accent transition-all duration-500">
                {currentFeature.title}
              </h3>
              
              <p className="text-base sm:text-lg text-arkin-accent/70 leading-relaxed max-w-xl transition-all duration-500">
                {currentFeature.desc}
              </p>
            </div>
          </Card>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-arkin-secondary/80 hover:bg-arkin-secondary backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 border border-arkin-accent/20 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-arkin-accent" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-arkin-secondary/80 hover:bg-arkin-secondary backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 border border-arkin-accent/20 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-arkin-accent" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-10 h-3 bg-arkin-primary'
                  : 'w-3 h-3 bg-arkin-accent/30 hover:bg-arkin-accent/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

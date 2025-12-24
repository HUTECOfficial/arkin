"use client"

import { useEffect, useRef, useState } from "react"
import Shepherd from "shepherd.js"
import "shepherd.js/dist/css/shepherd.css"
import "@/styles/shepherd-custom.css"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

const TOUR_STORAGE_KEY = "arkin-tour-completed"

type ShepherdTour = any

export function ShepherdTour() {
  const tourRef = useRef<ShepherdTour | null>(null)
  const [showStartButton, setShowStartButton] = useState(false)

  useEffect(() => {
    // Check if tour has been completed
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY)
    
    if (!tourCompleted) {
      // Show start button after 3 seconds for new visitors
      const timer = setTimeout(() => {
        setShowStartButton(true)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      // Show button immediately for returning visitors
      setShowStartButton(true)
    }
  }, [])

  const startTour = () => {
    if (tourRef.current) {
      tourRef.current.start()
      return
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: "shepherd-theme-custom",
        scrollTo: { behavior: "smooth", block: "center" },
        cancelIcon: {
          enabled: true,
        },
        modalOverlayOpeningPadding: window.innerWidth < 640 ? 12 : 16,
        modalOverlayOpeningRadius: window.innerWidth < 640 ? 12 : 16,
        popperOptions: {
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 12,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["top", "bottom", "left", "right"],
              },
            },
          ],
        },
      } as any,
    })

    // Define tour steps
    const steps: any[] = [
      {
        id: "welcome",
        title: "¡Bienvenido a ARKIN SELECT! 🎉",
        text: "Te voy a mostrar cómo navegar por nuestra plataforma inmobiliaria de manera rápida y sencilla. ¡Empecemos!",
        buttons: [
          {
            text: "Omitir",
            classes: "shepherd-button-secondary",
            action: () => tour.cancel(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "dynamic-island",
        title: "Isla Dinámica de Navegación ✨",
        text: "Esta barra flotante te permite acceder a todas las secciones principales. Se adapta a tu pantalla y siempre está disponible.",
        attachTo: window.innerWidth >= 640 ? {
          element: "div[class*='fixed'][class*='left-1/2']",
          on: "bottom" as const,
        } : undefined,
        buttons: [
          {
            text: "Anterior",
            classes: "shepherd-button-secondary",
            action: () => tour.back(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "hero-section",
        title: "Sección Principal 🏠",
        text: "Aquí encontrarás nuestro video de presentación y los botones principales para explorar propiedades o vender tu propiedad.",
        attachTo: {
          element: "section:first-of-type",
          on: "bottom" as const,
        },
        buttons: [
          {
            text: "Anterior",
            classes: "shepherd-button-secondary",
            action: () => tour.back(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "stats",
        title: "Nuestras Estadísticas 📊",
        text: "Mira nuestros números en tiempo real: propiedades activas, clientes satisfechos y años de experiencia.",
        attachTo: {
          element: "section:nth-of-type(2)",
          on: "top" as const,
        },
        buttons: [
          {
            text: "Anterior",
            classes: "shepherd-button-secondary",
            action: () => tour.back(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "featured-properties",
        title: "Propiedades Destacadas 🏢",
        text: "Carrusel interactivo con las mejores propiedades disponibles. Desliza para ver más opciones con fotos, precios y características.",
        attachTo: {
          element: "section:nth-of-type(3)",
          on: "top" as const,
        },
        buttons: [
          {
            text: "Anterior",
            classes: "shepherd-button-secondary",
            action: () => tour.back(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "why-arkin",
        title: "¿Por qué ARKIN SELECT? ❤️",
        text: "Confianza total con proceso transparente, exclusividad con propiedades únicas, y conexión directa entre compradores y vendedores.",
        attachTo: {
          element: "section:nth-of-type(4)",
          on: "top" as const,
        },
        buttons: [
          {
            text: "Anterior",
            classes: "shepherd-button-secondary",
            action: () => tour.back(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "assistant",
        title: "Asistente Virtual 24/7 📱",
        text: "¿Ves el botón dorado en la esquina? Es nuestro asistente virtual disponible las 24 horas. Puedes chatear o hacer una llamada con IA.",
        buttons: [
          {
            text: "Anterior",
            classes: "shepherd-button-secondary",
            action: () => tour.back(),
          },
          {
            text: "Siguiente",
            action: () => tour.next(),
          },
        ],
      },
      {
        id: "complete",
        title: "¡Listo! 🎊",
        text: "Ya conoces lo básico de ARKIN SELECT. Recuerda: proceso transparente, sin complicaciones. ¡Explora y encuentra tu próximo hogar!",
        buttons: [
          {
            text: "Finalizar",
            action: () => {
              localStorage.setItem(TOUR_STORAGE_KEY, "true")
              tour.complete()
            },
          },
        ],
      },
    ]

    // Add steps to tour
    steps.forEach((step) => tour.addStep(step))

    // Event handlers
    tour.on("complete", () => {
      localStorage.setItem(TOUR_STORAGE_KEY, "true")
    })

    tour.on("cancel", () => {
      localStorage.setItem(TOUR_STORAGE_KEY, "true")
    })

    tourRef.current = tour
    tour.start()
  }

  if (!showStartButton) return null

  return (
    <Button
      onClick={startTour}
      className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent shadow-2xl hover:shadow-arkin-primary/30 transition-all duration-300 z-50 hover:scale-110 group"
      title="Tutorial - Aprende a usar la plataforma"
    >
      <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform" />
    </Button>
  )
}

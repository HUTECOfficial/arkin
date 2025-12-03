"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { X, Heart, MessageCircle, CheckCircle } from "lucide-react"

interface NotificationToastProps {
  isOpen: boolean
  onClose: () => void
  onWhatsApp: () => void
  propertyTitle: string
  type?: "wishlist" | "success" | "info"
}

export function NotificationToast({ 
  isOpen, 
  onClose, 
  onWhatsApp, 
  propertyTitle,
  type = "wishlist" 
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Auto close after 8 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleWhatsAppClick = () => {
    onWhatsApp()
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Toast Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <Card className={`
          max-w-md w-full bg-arkin-secondary/50/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden
          pointer-events-auto transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
          }
        `}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-arkin-secondary/50/20 rounded-full flex items-center justify-center">
                  {type === "wishlist" ? (
                    <Heart className="h-5 w-5 text-white fill-current" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-white text-lg">
                    ¡Agregado a Favoritos!
                  </h3>
                  <p className="text-green-100 text-sm">
                    Propiedad guardada exitosamente
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-arkin-secondary/50/10 rounded-full w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {propertyTitle}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                La propiedad ha sido agregada a tu lista de favoritos. ¿Te gustaría contactarnos 
                por WhatsApp para obtener más información y agendar una cita?
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                onClick={handleWhatsAppClick}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-medium py-3 transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar por WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 rounded-2xl font-medium py-3 border-gray-200 hover:bg-arkin-secondary/70 transition-all duration-300"
              >
                Ahora no
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-arkin-secondary">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-[8000ms] ease-linear"
              style={{
                width: isVisible ? '0%' : '100%'
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

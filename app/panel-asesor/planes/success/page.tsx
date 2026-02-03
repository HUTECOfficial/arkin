'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Crown, Loader2 } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular verificación de pago
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-arkin-secondary flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 text-arkin-gold mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-arkin-graphite mb-2">
              Procesando tu pago...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras confirmamos tu suscripción
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arkin-secondary flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-arkin-gold/10 to-arkin-gold/5 border-arkin-gold/30">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-arkin-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <Crown className="h-12 w-12 text-arkin-gold mx-auto mb-4" />
          </div>

          <h1 className="text-3xl font-bold text-arkin-graphite mb-3">
            ¡Bienvenido al Plan Elite!
          </h1>
          
          <p className="text-gray-700 mb-6">
            Tu suscripción ha sido activada exitosamente. Ahora tienes acceso a:
          </p>

          <div className="bg-white/50 rounded-xl p-6 mb-6 text-left">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-arkin-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Propiedades ilimitadas</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-arkin-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Asistente con Inteligencia Artificial</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-arkin-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Panel de gestión avanzado</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-arkin-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Prioridad en soporte</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-arkin-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Marketing automatizado</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/panel-asesor')}
              className="w-full bg-arkin-gold hover:bg-arkin-gold/90 text-black font-semibold"
            >
              Ir al Panel
            </Button>
            <Button
              onClick={() => router.push('/panel-asesor/propiedades')}
              variant="outline"
              className="w-full"
            >
              Gestionar Propiedades
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-gray-500 mt-6">
              ID de sesión: {sessionId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

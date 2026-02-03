'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { subscriptionPlans } from '@/data/subscription-plans'
import { ArrowLeft, Check, Crown, Zap, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PlanesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated || user?.role !== 'asesor') {
    router.push('/login')
    return null
  }

  const handleSelectPlan = async (planId: 'core' | 'elite') => {
    if (planId === 'core') {
      toast.info('Ya estás en el Plan Core', {
        description: 'Este es tu plan actual'
      })
      return
    }

    // Para Plan Elite, crear sesión de pago con Stripe
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: 'elite',
          userId: user?.id,
          userEmail: user?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de pago')
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Error al procesar el pago', {
        description: error.message || 'Intenta nuevamente más tarde'
      })
      setLoading(false)
    }
  }

  const currentPlan = user?.plan || 'core'

  return (
    <div className="min-h-screen bg-arkin-secondary text-arkin-graphite p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/panel-asesor')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-arkin-graphite">
            Planes de Suscripción
          </h1>
          <p className="text-gray-600 text-lg">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id
            const isElite = plan.id === 'elite'

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  isElite
                    ? 'border-arkin-gold/50 bg-gradient-to-br from-arkin-gold/10 to-arkin-gold/5 shadow-xl'
                    : 'border-gray-300 bg-arkin-secondary/60'
                } ${isCurrentPlan ? 'ring-2 ring-arkin-gold' : ''}`}
              >
                {isElite && (
                  <div className="absolute top-0 right-0 bg-arkin-gold text-black px-4 py-1 text-xs font-bold">
                    RECOMENDADO
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isElite ? (
                        <div className="p-3 bg-arkin-gold rounded-xl">
                          <Crown className="h-8 w-8 text-white" />
                        </div>
                      ) : (
                        <div className="p-3 bg-blue-500 rounded-xl">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        {isCurrentPlan && (
                          <Badge className="mt-1 bg-arkin-gold text-black">
                            Plan Actual
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-arkin-graphite">
                        {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500">MXN/mes</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${
                          isElite ? 'bg-arkin-gold/20' : 'bg-blue-500/20'
                        }`}>
                          <Check className={`h-4 w-4 ${
                            isElite ? 'text-arkin-gold' : 'text-blue-600'
                          }`} />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan || loading}
                    className={`w-full ${
                      isElite
                        ? 'bg-arkin-gold hover:bg-arkin-gold/90 text-black'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {loading && isElite ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : isCurrentPlan ? (
                      'Plan Actual'
                    ) : isElite ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Actualizar a Elite
                      </>
                    ) : (
                      'Seleccionar Plan'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-arkin-graphite mb-2">
                  ¿Necesitas ayuda para elegir?
                </h3>
                <p className="text-gray-700 mb-4">
                  Nuestro equipo está listo para ayudarte a encontrar el plan perfecto para tu negocio.
                  Contáctanos para más información sobre características adicionales y opciones personalizadas.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/contacto')}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Contactar Soporte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

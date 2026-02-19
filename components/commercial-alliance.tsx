"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Building, Star, Zap, Loader2, Users, Crown } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function CommercialAlliance() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

    const handleSelectPlan = async (planId: string) => {
        console.log('handleSelectPlan called with planId:', planId)
        console.log('isAuthenticated:', isAuthenticated)
        console.log('user:', user)
        
        // Verificar si el usuario está autenticado
        if (!isAuthenticated || !user) {
            console.log('Usuario no autenticado, redirigiendo a login')
            toast.info('Inicia sesión para continuar', {
                description: 'Necesitas una cuenta de asesor para suscribirte'
            })
            router.push('/login?from=planes&redirect=/alianza-comercial')
            return
        }

        // Verificar que sea un asesor
        if (user.role !== 'asesor') {
            toast.error('Acceso denegado', {
                description: 'Solo los asesores pueden suscribirse a estos planes'
            })
            return
        }

        setLoading(true)
        setSelectedPlanId(planId)

        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: planId,
                    userId: user.id,
                    userEmail: user.email,
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
            setSelectedPlanId(null)
        }
    }

    const plans = [
        {
            id: "core",
            name: "Plan Core",
            price: "$99",
            period: "/mes",
            properties: "Hasta 6 Propiedades",
            description: "Perfecto para comenzar tu carrera como asesor inmobiliario.",
            features: [
                "Hasta 6 propiedades activas",
                "Panel de gestión básico",
                "Estadísticas de propiedades",
                "Gestión de leads",
                "Soporte por email",
                "Acceso a la plataforma web"
            ],
            icon: Building,
            color: "text-blue-500",
            borderColor: "border-blue-200",
            badge: "Básico"
        },
        {
            id: "elite",
            name: "Plan Elite",
            price: "$399",
            period: "/mes",
            properties: "7+ Propiedades",
            description: "Para asesores profesionales que buscan maximizar su potencial.",
            features: [
                "Propiedades ilimitadas (7+)",
                "Asistente con Inteligencia Artificial",
                "Panel de gestión avanzado",
                "Estadísticas detalladas y reportes",
                "Gestión avanzada de leads",
                "Prioridad en soporte",
                "Acceso a herramientas premium",
                "Marketing automatizado",
                "Análisis predictivo de mercado"
            ],
            icon: Zap,
            color: "text-arkin-gold",
            borderColor: "border-arkin-gold",
            badge: "Premium",
            highlight: true
        }
    ]

    return (
        <div className="min-h-screen bg-arkin-secondary relative overflow-hidden transition-all duration-500">
            {/* Geometric Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-arkin-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-arkin-primary/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-arkin-primary/5 rotate-45 blur-2xl"></div>
            </div>

            <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-arkin-accent/20 text-arkin-accent bg-arkin-accent/5 backdrop-blur-sm">
                            Alianza Comercial
                        </Badge>
                        <h1 className="font-serif text-4xl md:text-6xl font-black text-arkin-accent tracking-tight leading-tight">
                            Impulsa tu carrera <br />
                            <span className="text-arkin-primary">inmobiliaria</span>
                        </h1>
                        <p className="text-xl text-arkin-accent/70 max-w-2xl mx-auto font-light">
                            Únete a la red de asesores más exclusiva. Elige el plan que mejor se adapte a tu portafolio y comienza a crecer con Arkin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => {
                            const Icon = plan.icon
                            return (
                                <Card
                                    key={index}
                                    className={`relative flex flex-col transition-all duration-300 hover:shadow-2xl ${plan.highlight
                                            ? 'border-arkin-primary shadow-xl scale-105 z-10 bg-arkin-secondary/50/90 backdrop-blur-xl'
                                            : 'border-arkin-accent/10 hover:-translate-y-1 bg-arkin-secondary/50/60 backdrop-blur-lg hover:bg-arkin-secondary/50/80'
                                        }`}
                                >
                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-arkin-primary text-arkin-accent px-4 py-1 font-bold shadow-lg">Más Popular</Badge>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-arkin-primary/20' : 'bg-arkin-accent/5'}`}>
                                                <Icon className={`h-6 w-6 ${plan.highlight ? 'text-arkin-accent' : 'text-arkin-accent/70'}`} />
                                            </div>
                                            <Badge variant="secondary" className="font-medium bg-arkin-accent/5 text-arkin-accent">
                                                {plan.badge}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-arkin-accent">{plan.name}</CardTitle>
                                        <CardDescription className="mt-2 text-arkin-accent/60">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="mb-6">
                                            <span className="text-4xl font-black text-arkin-accent">{plan.price}</span>
                                            <span className="text-arkin-accent/50 ml-2 font-medium">{plan.period}</span>
                                            <div className="mt-2 font-semibold text-arkin-accent/80">{plan.properties}</div>
                                        </div>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${plan.highlight ? 'text-arkin-primary' : 'text-arkin-accent/40'}`} />
                                                    <span className="text-sm text-arkin-accent/70">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            onClick={() => handleSelectPlan(plan.id)}
                                            disabled={loading}
                                            className={`w-full py-7 text-lg font-bold rounded-xl transition-all duration-300 ${plan.highlight
                                                    ? 'bg-arkin-accent hover:bg-arkin-accent/90 text-arkin-primary shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                                    : 'bg-arkin-accent/5 hover:bg-arkin-accent/10 text-arkin-accent hover:scale-[1.02]'
                                                }`}
                                        >
                                            {loading && selectedPlanId === plan.id ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                    Procesando...
                                                </>
                                            ) : (
                                                'Seleccionar Plan'
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Team Plans Section */}
                    <div className="mt-16 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-600 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-arkin-accent">Planes para Equipos</h2>
                                <p className="text-arkin-accent/60 text-sm">Para 2 o más miembros · Precio por miembro/mes</p>
                            </div>
                        </div>
                        <p className="text-arkin-accent/70 mb-8 ml-1">
                            Ideal para equipos de asesores. Todos los miembros comparten las mismas ventajas a un precio reducido.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    id: "team-core",
                                    name: "Core Equipo",
                                    price: "$59",
                                    period: "/mes por miembro",
                                    properties: "Hasta 6 propiedades por miembro",
                                    description: "Plan Core para equipos de 2 o más miembros.",
                                    features: [
                                        "Hasta 6 propiedades activas por miembro",
                                        "Panel de gestión básico",
                                        "Estadísticas de propiedades",
                                        "Gestión de leads",
                                        "Soporte por email",
                                        "Mínimo 2 miembros"
                                    ],
                                    icon: Users,
                                    highlight: false
                                },
                                {
                                    id: "team-elite",
                                    name: "Elite Equipo",
                                    price: "$249",
                                    period: "/mes por miembro",
                                    properties: "Propiedades ilimitadas por miembro",
                                    description: "Plan Elite para equipos de 2 o más miembros.",
                                    features: [
                                        "Propiedades ilimitadas por miembro",
                                        "Asistente con Inteligencia Artificial",
                                        "Panel de gestión avanzado",
                                        "Estadísticas detalladas y reportes",
                                        "Gestión avanzada de leads",
                                        "Marketing automatizado",
                                        "Análisis predictivo de mercado",
                                        "Mínimo 2 miembros"
                                    ],
                                    icon: Crown,
                                    highlight: true
                                }
                            ].map((plan) => {
                                const Icon = plan.icon
                                return (
                                    <Card
                                        key={plan.id}
                                        className={`relative flex flex-col transition-all duration-300 hover:shadow-2xl ${plan.highlight
                                            ? 'border-purple-400 shadow-xl scale-105 z-10 bg-arkin-secondary/90 backdrop-blur-xl'
                                            : 'border-arkin-accent/10 hover:-translate-y-1 bg-arkin-secondary/60 backdrop-blur-lg'
                                        }`}
                                    >
                                        {plan.highlight && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <Badge className="bg-purple-600 text-white px-4 py-1 font-bold shadow-lg">Recomendado Equipo</Badge>
                                            </div>
                                        )}
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-purple-600/20' : 'bg-purple-400/10'}`}>
                                                    <Icon className={`h-6 w-6 ${plan.highlight ? 'text-purple-500' : 'text-purple-400'}`} />
                                                </div>
                                                <Badge variant="secondary" className="font-medium bg-purple-100 text-purple-700">
                                                    Equipo
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-arkin-accent">{plan.name}</CardTitle>
                                            <CardDescription className="mt-2 text-arkin-accent/60">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="mb-6">
                                                <span className="text-4xl font-black text-arkin-accent">{plan.price}</span>
                                                <span className="text-arkin-accent/50 ml-2 font-medium text-sm">{plan.period}</span>
                                                <div className="mt-2 font-semibold text-arkin-accent/80 text-sm">{plan.properties}</div>
                                                <p className="text-xs text-purple-500 font-medium mt-1">Mínimo 2 miembros</p>
                                            </div>
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${plan.highlight ? 'text-purple-500' : 'text-purple-400'}`} />
                                                        <span className="text-sm text-arkin-accent/70">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                onClick={() => handleSelectPlan(plan.id)}
                                                disabled={loading}
                                                className={`w-full py-7 text-lg font-bold rounded-xl transition-all duration-300 ${plan.highlight
                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700 hover:scale-[1.02]'
                                                }`}
                                            >
                                                {loading && selectedPlanId === plan.id ? (
                                                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Procesando...</>
                                                ) : (
                                                    <><Users className="h-5 w-5 mr-2" />Seleccionar para Equipo</>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-20 text-center bg-arkin-accent text-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-arkin-accent to-black"></div>
                        <div className="relative z-10">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">¿Tienes más de 50 propiedades?</h2>
                            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-light">
                                Contáctanos para diseñar un plan personalizado que se ajuste perfectamente a las necesidades de tu inmobiliaria.
                            </p>
                            <Link href="/contacto">
                                <Button size="lg" variant="outline" className="bg-transparent border-arkin-primary text-arkin-primary hover:bg-arkin-primary hover:text-arkin-accent transition-all duration-300 px-8 py-6 text-lg font-bold rounded-xl">
                                    Contactar Ventas
                                </Button>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-arkin-primary/10 rounded-full blur-3xl group-hover:bg-arkin-primary/20 transition-all duration-500"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-arkin-primary/5 rounded-full blur-3xl group-hover:bg-arkin-primary/10 transition-all duration-500"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

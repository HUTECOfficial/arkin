"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Building, Star, Zap } from "lucide-react"
import Link from "next/link"

export function CommercialAlliance() {
    const plans = [
        {
            name: "Inicial",
            price: "$500",
            period: "/mes",
            properties: "5 Propiedades",
            description: "Ideal para asesores que están comenzando.",
            features: [
                "Publicación de 5 propiedades",
                "Panel de control básico",
                "Soporte por correo",
                "Visibilidad en búsquedas"
            ],
            icon: Building,
            color: "text-blue-500",
            borderColor: "border-blue-200",
            badge: "Básico"
        },
        {
            name: "Profesional",
            price: "$1,000",
            period: "/mes",
            properties: "10 Propiedades",
            description: "Para asesores con un portafolio en crecimiento.",
            features: [
                "Publicación de 10 propiedades",
                "Panel de control avanzado",
                "Soporte prioritario",
                "Destacado en búsquedas",
                "Estadísticas de visitas"
            ],
            icon: Star,
            color: "text-arkin-gold",
            borderColor: "border-arkin-gold",
            badge: "Popular",
            highlight: true
        },
        {
            name: "Elite",
            price: "$2,000",
            period: "/mes",
            properties: "Más de 10",
            description: "La solución completa para agencias y top producers.",
            features: [
                "Propiedades ilimitadas",
                "Panel de control premium",
                "Soporte dedicado 24/7",
                "Máxima visibilidad",
                "Reportes avanzados",
                "Marketing personalizado"
            ],
            icon: Zap,
            color: "text-purple-500",
            borderColor: "border-purple-200",
            badge: "Premium"
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => {
                            const Icon = plan.icon
                            return (
                                <Card
                                    key={index}
                                    className={`relative flex flex-col transition-all duration-300 hover:shadow-2xl ${plan.highlight
                                            ? 'border-arkin-primary shadow-xl scale-105 z-10 bg-white/90 backdrop-blur-xl'
                                            : 'border-arkin-accent/10 hover:-translate-y-1 bg-white/60 backdrop-blur-lg hover:bg-white/80'
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
                                            className={`w-full py-7 text-lg font-bold rounded-xl transition-all duration-300 ${plan.highlight
                                                    ? 'bg-arkin-accent hover:bg-arkin-accent/90 text-arkin-primary shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                                    : 'bg-arkin-accent/5 hover:bg-arkin-accent/10 text-arkin-accent hover:scale-[1.02]'
                                                }`}
                                        >
                                            Seleccionar Plan
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
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

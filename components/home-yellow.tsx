import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Shield, Star, Users, MapPin, Home, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FeaturedPropertiesCarousel } from "./featured-properties-carousel"
import { VirtualToursSection } from "./virtual-tours-section"
import { AnimatedStats } from "./animated-stats"

export function HomeYellow() {
  return (
    <div className="min-h-screen bg-arkin-secondary relative overflow-hidden transition-all duration-500">
      {/* Hero Section - Bold & Minimalist */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20 pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
            style={{ backgroundImage: "url('/fondoarkin.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-arkin-secondary"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-between min-h-[80vh]">
          {/* Top Section - Badge and Title */}
          <div className="text-center pt-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-arkin-secondary/50/10 border-2 border-arkin-primary rounded-full backdrop-blur-md mb-4">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-arkin-primary" />
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Tu Inmobiliaria de Confianza
              </span>
            </div>

            {/* Main Logo Image */}
            <div className="px-4">
              <Image
                src="/arkin-select-white.png"
                alt="ARKIN SELECT"
                width={600}
                height={200}
                className="w-[220px] sm:w-[350px] md:w-[450px] lg:w-[550px] h-auto mx-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Middle Section - Spacer for image visibility */}
          <div className="flex-1"></div>

          {/* Bottom Section - Text and Buttons */}
          <div className="text-center pb-8">
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed px-4 drop-shadow mb-6">
              Conectamos directamente compradores y vendedores. Sin complicaciones.
            </p>

            {/* CTA Buttons - Bold Design */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link href="/propiedades" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-bold px-6 sm:px-10 py-4 sm:py-6 rounded-2xl text-sm sm:text-lg shadow-2xl shadow-arkin-primary/30 hover:scale-105 transition-all duration-300">
                  <Home className="h-4 w-4 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Explorar Propiedades
                </Button>
              </Link>
              <Link href="/propietarios" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-arkin-accent text-arkin-accent font-bold px-6 sm:px-10 py-4 sm:py-6 rounded-2xl text-sm sm:text-lg hover:bg-arkin-secondary/50 hover:text-arkin-accent transition-all duration-300 backdrop-blur-sm bg-arkin-secondary/20"
                >
                  Vender mi Propiedad
                  <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 ml-2 sm:ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Featured Properties Carousel */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-arkin-accent mb-4">
              Propiedades <span className="text-arkin-primary">Destacadas</span>
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-arkin-primary mx-auto rounded-full"></div>
          </div>
          <FeaturedPropertiesCarousel />
        </div>
      </section>

      {/* Features Section - Card Grid */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 bg-arkin-accent/3">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-arkin-accent mb-4">
              ¿Por qué ARKIN SELECT?
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-arkin-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
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
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 sm:p-8 bg-arkin-secondary border-2 border-arkin-accent/10 hover:border-arkin-primary rounded-3xl hover:shadow-2xl hover:shadow-arkin-primary/20 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-arkin-primary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-arkin-accent" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-arkin-accent mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-arkin-accent/70 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tours Section */}
      <VirtualToursSection />

      {/* CTA Section - Bold & Direct */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-arkin-accent rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-arkin-primary/10 to-transparent"></div>
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-arkin-secondary">
                ¿Listo para el siguiente paso?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-arkin-secondary/80 max-w-2xl mx-auto px-4">
                Únete a nuestros clientes satisfechos y descubre la facilidad de comprar o vender con ARKIN SELECT
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                <Link href="/contacto" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent font-bold px-8 sm:px-10 py-5 sm:py-7 rounded-2xl text-base sm:text-lg shadow-xl hover:scale-105 transition-all duration-300">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                    Contactar Ahora
                  </Button>
                </Link>
                <Link href="/propiedades" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-arkin-secondary text-arkin-secondary font-bold px-8 sm:px-10 py-5 sm:py-7 rounded-2xl text-base sm:text-lg hover:bg-arkin-secondary hover:text-arkin-accent transition-all duration-300"
                  >
                    Ver Propiedades
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

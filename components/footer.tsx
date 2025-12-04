import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden py-8">
      {/* Fondo negro base */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Contenedor principal con efecto de estrellas */}
      <div className="max-w-7xl mx-auto relative z-10 m-6">
        <div className="footer-container relative rounded-[3rem] overflow-hidden backdrop-blur-[1rem]">
          {/* Estrellas animadas de fondo */}
          <div className="container-stars absolute z-[-1] w-full h-full overflow-hidden transition-all duration-500 backdrop-blur-[1rem] rounded-[3rem]">
            <div className="stars-wrapper">
              <div className="stars"></div>
            </div>
          </div>
          
          {/* Efecto de brillo (glow) */}
          <div className="glow-effect absolute flex w-full h-full pointer-events-none">
            <div className="glow-circle glow-circle-1"></div>
            <div className="glow-circle glow-circle-2"></div>
          </div>
          
          {/* Contenido del footer */}
          <div className="relative z-10 px-6 py-16 bg-[#212121]">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image 
                src="/arkinlogo.jpg" 
                alt="ARKIN SELECT" 
                width={200} 
                height={60} 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 text-pretty">
              Conectamos directamente compradores y vendedores. Sin complicaciones.
              Proceso simple y transparente.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-arkin-gold/20 hover:bg-arkin-gold/40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 border border-arkin-gold/30">
                <span className="text-arkin-gold font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-arkin-gold/20 hover:bg-arkin-gold/40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 border border-arkin-gold/30">
                <span className="text-arkin-gold font-bold">in</span>
              </div>
              <div className="w-10 h-10 bg-arkin-gold/20 hover:bg-arkin-gold/40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 border border-arkin-gold/30">
                <span className="text-arkin-gold font-bold">@</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-white mb-6">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Marketing Digital
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Tours Virtuales
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Valoración IA
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-white mb-6">Soluciones</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/propiedades" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Venta
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Renta
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Compra
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Construcción
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-white mb-6">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/empresa" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Sobre ARKIN SELECT
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Nuestro Equipo
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Casos de Éxito
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Prensa
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                  Carreras
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-white mb-6">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-arkin-gold/20 rounded-full flex items-center justify-center mt-1 border border-arkin-gold/30">
                  <div className="w-2 h-2 bg-arkin-gold rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Oficina Principal</p>
                  <p className="text-gray-200">León, Gto</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-arkin-gold/20 rounded-full flex items-center justify-center mt-1 border border-arkin-gold/30">
                  <div className="w-2 h-2 bg-arkin-gold rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <Link href="/contacto" className="text-gray-200 hover:text-arkin-gold transition-colors">
                    arkinselect@gmail.com
                  </Link>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-arkin-gold/20 rounded-full flex items-center justify-center mt-1 border border-arkin-gold/30">
                  <div className="w-2 h-2 bg-arkin-gold rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <a 
                    href="https://wa.me/5214774756951?text=Hola%20ARKIN%20SELECT,%20me%20interesa%20obtener%20más%20información%20sobre%20sus%20servicios%20inmobiliarios."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-arkin-gold transition-colors flex items-center space-x-2"
                  >
                    <span>📱</span>
                    <span>+52 1 477 475 6951</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-arkin-gold/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="text-gray-300 text-sm">© 2024 ARKIN SELECT. Todos los derechos reservados.</div>
              <div className="text-gray-400 text-xs">Powered by HUTEC</div>
            </div>
            <div className="flex space-x-8 text-sm">
              <Link href="/legal" className="text-gray-300 hover:text-arkin-gold transition-colors duration-300">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </footer>
  )
}

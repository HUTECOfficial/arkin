"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  Send, 
  Bot, 
  User, 
  MessageSquare,
  ExternalLink,
  Sparkles,
  Search,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square
} from "lucide-react"
import Link from "next/link"

interface Property {
  id: number
  titulo: string
  ubicacion: string
  precio: number
  precioTexto: string
  tipo: string
  habitaciones: number
  banos: number
  area: number
  areaTexto: string
  imagen: string
  descripcion: string
  caracteristicas: string[]
  status: string
  fechaPublicacion?: string
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  properties?: Property[]
  suggestions?: string[]
}

interface AISearchChatProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
}

export function AISearchChat({ isOpen, onClose, properties }: AISearchChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente de búsqueda inteligente de ARKIN. Puedo ayudarte a encontrar la propiedad perfecta. ¿Qué tipo de propiedad estás buscando?',
      timestamp: new Date(),
      suggestions: [
        'Busco un penthouse en Polanco',
        'Quiero una casa con jardín',
        'Necesito 3 habitaciones máximo $15M',
        'Propiedades cerca del centro'
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Sistema de IA interno para procesar consultas
  const processAIQuery = (query: string): { results: Property[], response: string, suggestions?: string[] } => {
    const normalizedQuery = query.toLowerCase()
    
    // Palabras clave para diferentes criterios
    const locationKeywords = {
      'polanco': ['polanco'],
      'roma': ['roma', 'roma norte'],
      'condesa': ['condesa'],
      'santa fe': ['santa fe', 'santa'],
      'lomas': ['lomas', 'las lomas'],
      'interlomas': ['interlomas'],
      'leon': ['león', 'leon', 'guanajuato', 'gto'],
      'centro': ['centro', 'downtown']
    }

    const typeKeywords = {
      'penthouse': ['penthouse', 'ático'],
      'casa': ['casa', 'villa', 'residencia'],
      'departamento': ['departamento', 'depto', 'apartamento'],
      'loft': ['loft'],
      'condominio': ['condominio', 'condo']
    }

    const amenityKeywords = {
      'piscina': ['piscina', 'alberca', 'pool'],
      'jardin': ['jardín', 'jardin', 'garden'],
      'terraza': ['terraza', 'balcón', 'balcon'],
      'gimnasio': ['gimnasio', 'gym'],
      'seguridad': ['seguridad', 'vigilancia', '24/7'],
      'vista': ['vista', 'panorámica', 'view']
    }

    // Extraer números para precio y habitaciones
    const priceMatch = normalizedQuery.match(/(\d+(?:\.\d+)?)\s*(?:m|mill|millones?|mxn|\$)/i)
    const roomsMatch = normalizedQuery.match(/(\d+)\s*(?:hab|habitacion|habitaciones|recamara|recamaras|bedroom|bedrooms)/i)
    const bathsMatch = normalizedQuery.match(/(\d+)\s*(?:baño|baños|bathroom|bathrooms)/i)
    const areaMatch = normalizedQuery.match(/(\d+)\s*(?:m2|m²|metros|metro)/i)

    let filteredProperties = [...properties]

    // Filtrar por ubicación
    for (const [location, keywords] of Object.entries(locationKeywords)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        filteredProperties = filteredProperties.filter(prop => 
          prop.ubicacion.toLowerCase().includes(location) ||
          keywords.some(k => prop.ubicacion.toLowerCase().includes(k))
        )
        break
      }
    }

    // Filtrar por tipo de propiedad
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        filteredProperties = filteredProperties.filter(prop => 
          prop.tipo.toLowerCase().includes(type) ||
          keywords.some(k => prop.tipo.toLowerCase().includes(k))
        )
        break
      }
    }

    // Filtrar por amenidades
    for (const [amenity, keywords] of Object.entries(amenityKeywords)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        filteredProperties = filteredProperties.filter(prop => 
          prop.caracteristicas.some(car => 
            keywords.some(k => car.toLowerCase().includes(k))
          ) || prop.descripcion.toLowerCase().includes(amenity)
        )
      }
    }

    // Filtrar por precio
    if (priceMatch) {
      const maxPrice = parseFloat(priceMatch[1]) * 1000000 // Convertir millones
      if (normalizedQuery.includes('menos') || normalizedQuery.includes('máximo') || normalizedQuery.includes('hasta')) {
        filteredProperties = filteredProperties.filter(prop => prop.precio <= maxPrice)
      } else if (normalizedQuery.includes('más') || normalizedQuery.includes('mínimo') || normalizedQuery.includes('desde')) {
        filteredProperties = filteredProperties.filter(prop => prop.precio >= maxPrice)
      }
    }

    // Filtrar por habitaciones
    if (roomsMatch) {
      const rooms = parseInt(roomsMatch[1])
      if (normalizedQuery.includes('menos') || normalizedQuery.includes('máximo')) {
        filteredProperties = filteredProperties.filter(prop => prop.habitaciones <= rooms)
      } else if (normalizedQuery.includes('más') || normalizedQuery.includes('mínimo')) {
        filteredProperties = filteredProperties.filter(prop => prop.habitaciones >= rooms)
      } else {
        filteredProperties = filteredProperties.filter(prop => prop.habitaciones === rooms)
      }
    }

    // Filtrar por baños
    if (bathsMatch) {
      const baths = parseInt(bathsMatch[1])
      filteredProperties = filteredProperties.filter(prop => prop.banos >= baths)
    }

    // Filtrar por área
    if (areaMatch) {
      const area = parseInt(areaMatch[1])
      if (normalizedQuery.includes('menos') || normalizedQuery.includes('máximo')) {
        filteredProperties = filteredProperties.filter(prop => prop.area <= area)
      } else if (normalizedQuery.includes('más') || normalizedQuery.includes('mínimo')) {
        filteredProperties = filteredProperties.filter(prop => prop.area >= area)
      }
    }

    // Generar respuesta basada en resultados
    let response = ''
    let suggestions: string[] = []

    if (filteredProperties.length === 0) {
      response = `No encontré propiedades que coincidan exactamente con tu búsqueda "${query}". Pero no te preocupes, nuestro equipo de especialistas puede ayudarte a encontrar opciones personalizadas. Te conectaré con un asesor experto.`
      suggestions = [
        'Hablar con un especialista',
        'Ver todas las propiedades disponibles',
        'Buscar algo similar'
      ]
    } else if (filteredProperties.length === 1) {
      const prop = filteredProperties[0]
      response = `¡Perfecto! Encontré una propiedad que coincide con tu búsqueda: **${prop.titulo}** en ${prop.ubicacion}. ${prop.habitaciones} habitaciones, ${prop.banos} baños, ${prop.areaTexto} por ${prop.precioTexto}.`
      suggestions = [
        'Ver más detalles de esta propiedad',
        'Buscar propiedades similares',
        'Agendar una visita'
      ]
    } else {
      response = `Excelente! Encontré **${filteredProperties.length} propiedades** que coinciden con tu búsqueda. Aquí tienes las mejores opciones:`
      suggestions = [
        'Ver todas las opciones',
        'Refinar mi búsqueda',
        'Comparar propiedades'
      ]
    }

    return { results: filteredProperties, response, suggestions }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular delay de procesamiento
    setTimeout(() => {
      const aiResult = processAIQuery(inputValue)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResult.response,
        timestamp: new Date(),
        properties: aiResult.results,
        suggestions: aiResult.suggestions
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Hablar con un especialista') {
      const whatsappNumber = '+5247712345678'
      const message = encodeURIComponent('Hola, me interesa obtener ayuda personalizada para encontrar una propiedad exclusiva con ARKIN.')
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
      return
    }
    
    setInputValue(suggestion)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-4 top-4 bottom-4 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-arkin-gold to-yellow-400 text-black p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Búsqueda con IA</CardTitle>
                <p className="text-sm opacity-90">Asistente inteligente ARKIN</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-black hover:bg-black/10 rounded-full w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-arkin-gold text-black' 
                      : 'bg-gray-100 text-arkin-gold'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-arkin-gold text-black'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Properties Results */}
                {message.properties && message.properties.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.properties.slice(0, 3).map((property) => (
                      <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex space-x-3">
                            <img
                              src={property.imagen || "/placeholder.svg"}
                              alt={property.titulo}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{property.titulo}</h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{property.ubicacion}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-3 text-xs text-gray-600">
                                  <span className="flex items-center space-x-1">
                                    <Bed className="h-3 w-3" />
                                    <span>{property.habitaciones}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Bath className="h-3 w-3" />
                                    <span>{property.banos}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Square className="h-3 w-3" />
                                    <span>{property.area}m²</span>
                                  </span>
                                </div>
                                <Link href={`/propiedades/${property.id}`}>
                                  <Button size="sm" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black text-xs h-6 px-2">
                                    Ver
                                  </Button>
                                </Link>
                              </div>
                              <p className="text-sm font-semibold text-arkin-gold mt-1">
                                {formatPrice(property.precio)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {message.properties.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{message.properties.length - 3} propiedades más
                      </p>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left justify-start text-xs h-8 border-arkin-gold/30 hover:bg-arkin-gold/10 hover:border-arkin-gold"
                      >
                        {suggestion === 'Hablar con un especialista' && <ExternalLink className="h-3 w-3 mr-2" />}
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-arkin-gold flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe la propiedad que buscas..."
              className="flex-1 border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-arkin-gold hover:bg-arkin-gold/90 text-black"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by ARKIN AI • Respuestas instantáneas
          </p>
        </div>
      </div>
    </div>
  )
}

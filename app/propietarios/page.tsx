"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Upload, 
  Shield, 
  Star, 
  FileText, 
  MapPin,
  Camera,
  DollarSign,
  Home,
  User,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  X,
  Plus,
  Eye,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { OwnerSubmissionsStorage } from "@/lib/owner-submissions-storage"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function PropietariosPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submissionId, setSubmissionId] = useState<string>('')
  const [formData, setFormData] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    neighborhood: '',
    postalCode: '',
    askingPrice: '',
    urgency: '',
    description: '',
    amenities: [] as string[],
    photos: [] as File[],
    ownerName: '',
    phone: '',
    email: '',
    preferredContact: '',
    exclusivity: false,
    terms: false,
    privacy: false
  })
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [priceEstimate, setPriceEstimate] = useState<number | null>(null)

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const amenitiesList = [
    'Piscina', 'Jardín privado', 'Terraza', 'Balcón', 'Gimnasio',
    'Spa', 'Seguridad 24/7', 'Estacionamiento', 'Elevador',
    'Vista panorámica', 'Chimenea', 'Cocina equipada', 'Aire acondicionado',
    'Calefacción', 'Jacuzzi', 'Sala de juegos', 'Oficina', 'Bodega'
  ]

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedPhotos(prev => [...prev, ...files as File[]])
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const calculateEstimate = () => {
    // Simulación de cálculo de precio estimado
    if (formData.area && formData.neighborhood) {
      const basePrice = parseInt(formData.area) * 45000 // Precio base por m²
      const locationMultiplier = formData.neighborhood.toLowerCase().includes('polanco') ? 1.8 :
                                formData.neighborhood.toLowerCase().includes('santa fe') ? 1.6 :
                                formData.neighborhood.toLowerCase().includes('roma') ? 1.4 : 1.2
      const estimate = basePrice * locationMultiplier
      setPriceEstimate(estimate)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!formData.propertyType || !formData.area || !formData.bedrooms || !formData.bathrooms) {
      toast.error('Por favor completa todos los campos requeridos de la propiedad')
      return
    }

    if (!formData.address || !formData.city || !formData.neighborhood) {
      toast.error('Por favor completa la información de ubicación')
      return
    }

    if (!formData.askingPrice || !formData.description) {
      toast.error('Por favor completa el precio y descripción')
      return
    }

    if (!formData.ownerName || !formData.phone || !formData.email) {
      toast.error('Por favor completa tu información de contacto')
      return
    }

    if (!formData.exclusivity || !formData.terms || !formData.privacy) {
      toast.error('Debes aceptar todos los términos para continuar')
      return
    }

    setIsSubmitting(true)

    try {
      // Guardar en localStorage
      const submission = OwnerSubmissionsStorage.add({
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        address: formData.address,
        city: formData.city,
        neighborhood: formData.neighborhood,
        postalCode: formData.postalCode,
        askingPrice: formData.askingPrice,
        urgency: formData.urgency,
        description: formData.description,
        amenities: formData.amenities,
        photoCount: uploadedPhotos.length,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        preferredContact: formData.preferredContact,
        exclusivity: formData.exclusivity,
        terms: formData.terms,
        privacy: formData.privacy,
        estimatedValue: priceEstimate || undefined
      })

      setSubmissionId(submission.id)
      setSubmissionSuccess(true)
      
      toast.success('¡Registro exitoso!', {
        description: 'Tu propiedad ha sido registrada. Te contactaremos pronto.'
      })

      // Simular envío a servidor (aquí podrías hacer un fetch a tu API)
      console.log('Submission saved:', submission)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error al enviar el formulario', {
        description: 'Por favor intenta nuevamente'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pantalla de éxito
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-arkin-secondary transition-colors duration-500 pt-20 flex items-center justify-center px-6">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="font-serif text-3xl font-bold text-arkin-graphite mb-4">
              ¡Registro Exitoso!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Tu propiedad ha sido registrada exitosamente en ARKIN SELECT
            </p>

            <div className="bg-arkin-gold/10 border border-arkin-gold/20 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-arkin-gold mr-2" />
                <h3 className="font-semibold text-arkin-gold">ID de Registro</h3>
              </div>
              <p className="text-2xl font-mono font-bold text-arkin-graphite">
                {submissionId}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Guarda este ID para futuras referencias
              </p>
            </div>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-arkin-graphite">Contacto en 2 horas</p>
                  <p className="text-sm text-gray-600">Un especialista se comunicará contigo</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-arkin-graphite">Valoración profesional</p>
                  <p className="text-sm text-gray-600">Análisis detallado de tu propiedad</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-arkin-graphite">Marketing premium</p>
                  <p className="text-sm text-gray-600">Exposición en nuestros canales exclusivos</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/')}
                className="bg-arkin-gold hover:bg-arkin-gold/90 text-black"
              >
                Volver al Inicio
              </Button>
              <Button
                onClick={() => router.push('/propiedades')}
                variant="outline"
                className="border-arkin-gold text-arkin-gold hover:bg-arkin-gold/10"
              >
                Ver Propiedades
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              📧 Te hemos enviado un correo de confirmación a <strong>{formData.email}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arkin-secondary transition-colors duration-500 pt-20">

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-arkin-graphite mb-2">
              Registro de Propiedad Exclusiva
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proceso guiado para maximizar el valor de tu propiedad
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-arkin-gold">Progreso</span>
              <span className="text-sm font-medium text-arkin-gold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-arkin-gold text-black' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {step === 1 && 'Propiedad'}
                    {step === 2 && 'Ubicación'}
                    {step === 3 && 'Detalles'}
                    {step === 4 && 'Fotos'}
                    {step === 5 && 'Contacto'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center border-arkin-gold/20 bg-gradient-to-br from-arkin-gold/5 to-transparent">
            <Shield className="h-6 w-6 text-arkin-gold mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-arkin-graphite mb-1">Exclusividad</h3>
            <p className="text-xs text-gray-600">Sin competencia</p>
          </Card>
          <Card className="p-4 text-center border-arkin-gold/20 bg-gradient-to-br from-arkin-gold/5 to-transparent">
            <TrendingUp className="h-6 w-6 text-arkin-gold mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-arkin-graphite mb-1">Valoración IA</h3>
            <p className="text-xs text-gray-600">Precio óptimo</p>
          </Card>
          <Card className="p-4 text-center border-arkin-gold/20 bg-gradient-to-br from-arkin-gold/5 to-transparent">
            <Star className="h-6 w-6 text-arkin-gold mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-arkin-graphite mb-1">Marketing Premium</h3>
            <p className="text-xs text-gray-600">Máxima exposición</p>
          </Card>
          <Card className="p-4 text-center border-arkin-gold/20 bg-gradient-to-br from-arkin-gold/5 to-transparent">
            <Calendar className="h-6 w-6 text-arkin-gold mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-arkin-graphite mb-1">Venta Rápida</h3>
            <p className="text-xs text-gray-600">Promedio 45 días</p>
          </Card>
        </div>

        {/* Multi-Step Form */}
        <Card className="border-0 shadow-xl overflow-hidden">
          {/* Step 1: Property Information */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-arkin-gold rounded-full flex items-center justify-center mr-4">
                  <Home className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-arkin-graphite">
                    Información de la Propiedad
                  </h2>
                  <p className="text-gray-600">Cuéntanos sobre tu propiedad exclusiva</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="property-type" className="text-sm font-medium text-gray-700">
                    Tipo de Propiedad *
                  </Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => setFormData(prev => ({...prev, propertyType: value}))}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="casa">Casa de Lujo</SelectItem>
                      <SelectItem value="departamento">Departamento Premium</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                      <SelectItem value="residencia">Residencia</SelectItem>
                      <SelectItem value="condominio">Condominio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium text-gray-700">
                    Área Total (m²) *
                  </Label>
                  <Input 
                    id="area" 
                    placeholder="Ej: 450" 
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({...prev, area: e.target.value}))}
                    onBlur={calculateEstimate}
                    className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                    Habitaciones *
                  </Label>
                  <Select 
                    value={formData.bedrooms} 
                    onValueChange={(value) => setFormData(prev => ({...prev, bedrooms: value}))}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                      <SelectValue placeholder="Número de habitaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 habitación</SelectItem>
                      <SelectItem value="2">2 habitaciones</SelectItem>
                      <SelectItem value="3">3 habitaciones</SelectItem>
                      <SelectItem value="4">4 habitaciones</SelectItem>
                      <SelectItem value="5">5 habitaciones</SelectItem>
                      <SelectItem value="6+">6+ habitaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700">
                    Baños *
                  </Label>
                  <Select 
                    value={formData.bathrooms} 
                    onValueChange={(value) => setFormData(prev => ({...prev, bathrooms: value}))}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                      <SelectValue placeholder="Número de baños" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 baño</SelectItem>
                      <SelectItem value="2">2 baños</SelectItem>
                      <SelectItem value="3">3 baños</SelectItem>
                      <SelectItem value="4">4 baños</SelectItem>
                      <SelectItem value="5">5 baños</SelectItem>
                      <SelectItem value="6+">6+ baños</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Estimate */}
              {priceEstimate && (
                <div className="mt-6 p-4 bg-arkin-gold/10 rounded-lg border border-arkin-gold/20">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-arkin-gold mr-2" />
                    <h3 className="font-semibold text-arkin-gold">Valoración Estimada por IA</h3>
                  </div>
                  <p className="text-2xl font-bold text-arkin-gold">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 0
                    }).format(priceEstimate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Estimación basada en ubicación y características similares
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-arkin-gold rounded-full flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-arkin-graphite">
                    Ubicación Privilegiada
                  </h2>
                  <p className="text-gray-600">La ubicación es clave para maximizar el valor</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Dirección Completa *
                  </Label>
                  <Input 
                    id="address" 
                    placeholder="Calle, número, colonia"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                    className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-sm font-medium text-gray-700">
                    Colonia/Zona *
                  </Label>
                  <Select 
                    value={formData.neighborhood} 
                    onValueChange={(value) => {
                      setFormData(prev => ({...prev, neighborhood: value}))
                      calculateEstimate()
                    }}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                      <SelectValue placeholder="Selecciona la zona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Polanco">Polanco</SelectItem>
                      <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                      <SelectItem value="Roma Norte">Roma Norte</SelectItem>
                      <SelectItem value="Condesa">Condesa</SelectItem>
                      <SelectItem value="Las Lomas">Las Lomas</SelectItem>
                      <SelectItem value="Interlomas">Interlomas</SelectItem>
                      <SelectItem value="León Centro">León Centro</SelectItem>
                      <SelectItem value="León Zona Dorada">León Zona Dorada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Ciudad *
                  </Label>
                  <Select 
                    value={formData.city} 
                    onValueChange={(value) => setFormData(prev => ({...prev, city: value}))}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                      <SelectValue placeholder="Selecciona la ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ciudad de México">Ciudad de México</SelectItem>
                      <SelectItem value="León, Guanajuato">León, Guanajuato</SelectItem>
                      <SelectItem value="Guadalajara">Guadalajara</SelectItem>
                      <SelectItem value="Monterrey">Monterrey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal-code" className="text-sm font-medium text-gray-700">
                    Código Postal
                  </Label>
                  <Input 
                    id="postal-code" 
                    placeholder="Ej: 11560"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({...prev, postalCode: e.target.value}))}
                    className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details & Pricing */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-arkin-gold rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-arkin-graphite">
                    Detalles y Precio
                  </h2>
                  <p className="text-gray-600">Características que hacen única tu propiedad</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="asking-price" className="text-sm font-medium text-gray-700">
                      Precio Solicitado (MXN) *
                    </Label>
                    <Input 
                      id="asking-price" 
                      placeholder="Ej: $15,000,000"
                      value={formData.askingPrice}
                      onChange={(e) => setFormData(prev => ({...prev, askingPrice: e.target.value}))}
                      className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-sm font-medium text-gray-700">
                      Tiempo Ideal de Venta
                    </Label>
                    <Select 
                      value={formData.urgency} 
                      onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                        <SelectValue placeholder="Selecciona tiempo ideal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Menos de 3 meses</SelectItem>
                        <SelectItem value="medium">3-6 meses</SelectItem>
                        <SelectItem value="flexible">6-12 meses</SelectItem>
                        <SelectItem value="patient">Sin prisa, busco el mejor precio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Descripción Detallada *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe las características especiales, acabados de lujo, vistas, etc."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Amenidades Destacadas
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div 
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.amenities.includes(amenity)
                            ? 'border-arkin-gold bg-arkin-gold/10 text-arkin-gold'
                            : 'border-gray-200 hover:border-arkin-gold/50 hover:bg-arkin-secondary/70'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            formData.amenities.includes(amenity)
                              ? 'border-arkin-gold bg-arkin-gold'
                              : 'border-gray-300'
                          }`}>
                            {formData.amenities.includes(amenity) && (
                              <CheckCircle className="h-3 w-3 text-black" />
                            )}
                          </div>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-arkin-gold rounded-full flex items-center justify-center mr-4">
                  <Camera className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-arkin-graphite">
                    Fotografías Profesionales
                  </h2>
                  <p className="text-gray-600">Las imágenes son clave para atraer compradores</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-arkin-gold/30 rounded-xl p-8 text-center bg-arkin-gold/5">
                  <Camera className="h-16 w-16 text-arkin-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-arkin-graphite mb-2">
                    Sube las fotos de tu propiedad
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Arrastra y suelta las imágenes o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      type="button"
                      className="bg-arkin-gold hover:bg-arkin-gold/90 text-black"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar Fotos
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Máximo 20 fotos • JPG, PNG • Máximo 10MB por foto
                  </p>
                </div>

                {/* Photo Preview */}
                {uploadedPhotos.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Fotos subidas ({uploadedPhotos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-arkin-secondary rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💡 Tips para mejores fotos
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Toma fotos con buena iluminación natural</li>
                    <li>• Incluye todas las habitaciones principales</li>
                    <li>• Muestra las amenidades especiales</li>
                    <li>• Captura las vistas panorámicas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Contact & Agreement */}
          {currentStep === 5 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-arkin-gold rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-arkin-graphite">
                    Información de Contacto
                  </h2>
                  <p className="text-gray-600">Finaliza tu registro exclusivo</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name" className="text-sm font-medium text-gray-700">
                      Nombre Completo *
                    </Label>
                    <Input 
                      id="owner-name" 
                      placeholder="Tu nombre completo"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({...prev, ownerName: e.target.value}))}
                      className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Teléfono *
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="+52 477 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Correo Electrónico *
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-contact" className="text-sm font-medium text-gray-700">
                      Horario Preferido
                    </Label>
                    <Select 
                      value={formData.preferredContact} 
                      onValueChange={(value) => setFormData(prev => ({...prev, preferredContact: value}))}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-arkin-gold focus:ring-arkin-gold/20">
                        <SelectValue placeholder="Selecciona horario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Mañana (9:00 - 12:00)</SelectItem>
                        <SelectItem value="afternoon">Tarde (12:00 - 18:00)</SelectItem>
                        <SelectItem value="evening">Noche (18:00 - 21:00)</SelectItem>
                        <SelectItem value="anytime">Cualquier horario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Agreement Section */}
                <div className="bg-gradient-to-br from-arkin-gold/5 to-transparent p-6 rounded-xl border border-arkin-gold/20">
                  <h3 className="font-serif text-xl font-semibold text-arkin-graphite mb-4">
                    Acuerdo de Exclusividad Premium
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="exclusivity" 
                        checked={formData.exclusivity}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, exclusivity: checked as boolean}))}
                        className="mt-1 border-arkin-gold data-[state=checked]:bg-arkin-gold data-[state=checked]:border-arkin-gold"
                      />
                      <Label htmlFor="exclusivity" className="text-sm leading-relaxed">
                        <strong>Acepto la exclusividad de 6 meses</strong> para maximizar el valor de mi propiedad. 
                        Entiendo que esto garantiza atención personalizada, marketing premium y mejores resultados.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="terms" 
                        checked={formData.terms}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, terms: checked as boolean}))}
                        className="mt-1 border-arkin-gold data-[state=checked]:bg-arkin-gold data-[state=checked]:border-arkin-gold"
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        Acepto los <strong>términos y condiciones</strong> del servicio premium de ARKIN, 
                        incluyendo la comisión competitiva del 4% sobre el precio final de venta.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="privacy" 
                        checked={formData.privacy}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, privacy: checked as boolean}))}
                        className="mt-1 border-arkin-gold data-[state=checked]:bg-arkin-gold data-[state=checked]:border-arkin-gold"
                      />
                      <Label htmlFor="privacy" className="text-sm leading-relaxed">
                        Autorizo el <strong>tratamiento de mis datos</strong> conforme a la política de privacidad 
                        de ARKIN para fines de comercialización exclusiva de mi propiedad.
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-8 py-6 bg-arkin-secondary/70 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-gray-200 hover:border-arkin-gold hover:text-arkin-gold"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="flex items-center space-x-4">
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-arkin-gold hover:bg-arkin-gold/90 text-black px-8"
                  >
                    Continuar
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!formData.exclusivity || !formData.terms || !formData.privacy || isSubmitting}
                    className="bg-arkin-gold hover:bg-arkin-gold/90 text-black px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Registrar Propiedad Exclusiva
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {currentStep === totalSteps && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                🚀 Un especialista de ARKIN se pondrá en contacto contigo en las próximas 2 horas
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

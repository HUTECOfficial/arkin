"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Propiedad } from "@/data/propiedades"
import { Upload, X, Plus } from "lucide-react"

interface PropertyFormProps {
  initialData?: Propiedad
  asesorEmail: string
  asesorNombre: string
  onSubmit: (data: Omit<Propiedad, 'id'>) => void
  onCancel?: () => void
}

export function PropertyForm({ initialData, asesorEmail, asesorNombre, onSubmit, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Propiedad>>(initialData || {
    titulo: "",
    ubicacion: "",
    precio: undefined,
    tipo: "Departamento",
    habitaciones: undefined,
    banos: undefined,
    mediosBanos: undefined,
    area: undefined,
    areaConstruccion: undefined,
    cochera: undefined,
    descripcion: "",
    caracteristicas: [],
    status: "Disponible",
    imagen: "",
    galeria: []
  })

  const [caracteristica, setCaracteristica] = useState("")
  const [amenidadesSeleccionadas, setAmenidadesSeleccionadas] = useState<string[]>(
    (initialData?.detalles as any)?.amenidades || []
  )
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imagen || "")
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(initialData?.galeria || [])

  // Lista de amenidades disponibles
  const amenidadesDisponibles = [
    "Seguridad 24/7",
    "Estacionamiento",
    "Gimnasio",
    "Alberca",
    "Alberca Techada",
    "Jardín",
    "Internet",
    "Terraza",
    "Spa",
    "Roof Garden",
    "Área de Juegos",
    "Salón de Eventos",
    "Bodega",
    "Cuarto de Servicio",
    "Cuarto de Lavado",
    "Elevador",
    "Portero",
    "Área de BBQ",
    "Pet Friendly",
    "Tinaco",
    "Calentador Solar",
    "Hidroneumático",
    "Aljibe"
  ]

  const toggleAmenidad = (amenidad: string) => {
    setAmenidadesSeleccionadas(prev => 
      prev.includes(amenidad) 
        ? prev.filter(a => a !== amenidad)
        : [...prev, amenidad]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const propertyData: Omit<Propiedad, 'id'> = {
      titulo: formData.titulo || "",
      ubicacion: formData.ubicacion || "",
      precio: formData.precio || 0,
      precioTexto: `$${(formData.precio || 0).toLocaleString('es-MX')}`,
      tipo: formData.tipo || "Departamento",
      habitaciones: formData.habitaciones || 1,
      banos: formData.banos || 1,
      mediosBanos: formData.mediosBanos || 0,
      area: formData.area || 0,
      areaConstruccion: formData.areaConstruccion || 0,
      cochera: formData.cochera || 0,
      areaTexto: `${formData.area || 0} m²`,
      imagen: formData.imagen || "/placeholder-property.jpg",
      descripcion: formData.descripcion || "",
      caracteristicas: formData.caracteristicas || [],
      status: formData.status as "Disponible" | "Exclusiva" | "Reservada" || "Disponible",
      categoria: "venta", // Categoría por defecto
      fechaPublicacion: new Date().toISOString().split('T')[0],
      agente: {
        nombre: asesorNombre,
        especialidad: "Asesor Inmobiliario",
        rating: 4.5,
        ventas: 0,
        telefono: "+52 1 477 475 6951",
        email: asesorEmail
      },
      detalles: {
        tipoPropiedad: formData.tipo || "Departamento",
        areaTerreno: `${formData.area || 0} m²`,
        antiguedad: "Nueva",
        vistas: 0,
        favoritos: 0,
        publicado: new Date().toLocaleDateString('es-MX'),
        amenidades: amenidadesSeleccionadas
      } as any,
      galeria: galleryPreviews, // Usar las imágenes de la galería
      tourVirtual: undefined,
      tipoCredito: (formData as any).tipoCredito || undefined
    } as any

    console.log('Enviando propiedad:', propertyData)
    onSubmit(propertyData)
  }

  const addCaracteristica = () => {
    if (caracteristica.trim()) {
      setFormData({
        ...formData,
        caracteristicas: [...(formData.caracteristicas || []), caracteristica.trim()]
      })
      setCaracteristica("")
    }
  }

  const removeCaracteristica = (index: number) => {
    setFormData({
      ...formData,
      caracteristicas: formData.caracteristicas?.filter((_, i) => i !== index)
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5MB')
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData({ ...formData, imagen: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)

    // Validar que no sean más de 10 imágenes en total
    if (galleryPreviews.length + fileArray.length > 10) {
      alert('Máximo 10 imágenes en la galería')
      return
    }

    fileArray.forEach(file => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`)
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} no debe superar 5MB`)
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setGalleryPreviews(prev => [...prev, base64String])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData({ ...formData, imagen: "" })
  }

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>Datos principales de la propiedad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Penthouse Polanco IV"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                required
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                placeholder="Ej: Polanco, CDMX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio (MXN) *</Label>
              <Input
                id="precio"
                type="number"
                required
                value={formData.precio || ''}
                onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                placeholder="18500000"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Propiedad *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Departamento">Departamento</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Loft">Loft</SelectItem>
                  <SelectItem value="Residencia">Residencia</SelectItem>
                  <SelectItem value="Bodega">Bodega</SelectItem>
                  <SelectItem value="Nave Industrial">Nave Industrial</SelectItem>
                  <SelectItem value="Terreno (m²)">Terreno (m²)</SelectItem>
                  <SelectItem value="Rancho">Rancho</SelectItem>
                  <SelectItem value="Hectáreas">Hectáreas</SelectItem>
                  <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                  <SelectItem value="Oficina">Oficina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Habitaciones *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, habitaciones: num })}
                    className={`
                      h-10 w-10 rounded-lg border flex items-center justify-center transition-all
                      ${formData.habitaciones === num
                        ? 'bg-arkin-gold text-black border-arkin-gold font-bold shadow-md scale-105'
                        : 'bg-arkin-secondary/50 text-gray-600 border-gray-200 hover:border-arkin-gold/50 hover:bg-arkin-gold/5'
                      }
                    `}
                  >
                    {num}{num === 5 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Baños Completos *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, banos: num })}
                    className={`
                      h-10 w-10 rounded-lg border flex items-center justify-center transition-all
                      ${formData.banos === num
                        ? 'bg-arkin-gold text-black border-arkin-gold font-bold shadow-md scale-105'
                        : 'bg-arkin-secondary/50 text-gray-600 border-gray-200 hover:border-arkin-gold/50 hover:bg-arkin-gold/5'
                      }
                    `}
                  >
                    {num}{num === 5 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Medios Baños</Label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, mediosBanos: num })}
                    className={`
                      h-10 w-10 rounded-lg border flex items-center justify-center transition-all
                      ${formData.mediosBanos === num
                        ? 'bg-arkin-gold text-black border-arkin-gold font-bold shadow-md scale-105'
                        : 'bg-arkin-secondary/50 text-gray-600 border-gray-200 hover:border-arkin-gold/50 hover:bg-arkin-gold/5'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área Terreno (m²) *</Label>
              <Input
                id="area"
                type="number"
                required
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                placeholder="450"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaConstruccion">Área Construcción (m²)</Label>
              <Input
                id="areaConstruccion"
                type="number"
                value={formData.areaConstruccion || ''}
                onChange={(e) => setFormData({ ...formData, areaConstruccion: Number(e.target.value) })}
                placeholder="350"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Cochera (Coches)</Label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, cochera: num })}
                    className={`
                      h-10 w-10 rounded-lg border flex items-center justify-center transition-all
                      ${formData.cochera === num
                        ? 'bg-arkin-gold text-black border-arkin-gold font-bold shadow-md scale-105'
                        : 'bg-arkin-secondary/50 text-gray-600 border-gray-200 hover:border-arkin-gold/50 hover:bg-arkin-gold/5'
                      }
                    `}
                  >
                    {num}{num === 5 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Exclusiva">Exclusiva</SelectItem>
                  <SelectItem value="Reservada">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoCredito">Tipo de Crédito</Label>
              <Select
                value={(formData as any).tipoCredito || ''}
                onValueChange={(value) => setFormData({ ...formData, tipoCredito: value } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo de crédito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contado">Contado</SelectItem>
                  <SelectItem value="Crédito Bancario">Crédito Bancario</SelectItem>
                  <SelectItem value="Infonavit">Infonavit</SelectItem>
                  <SelectItem value="Fovissste">Fovissste</SelectItem>
                  <SelectItem value="Cofinavit">Cofinavit</SelectItem>
                  <SelectItem value="Crédito Puente">Crédito Puente</SelectItem>
                  <SelectItem value="Cualquier Crédito">Cualquier Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Uso *</Label>
            <Textarea
              id="descripcion"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el uso de la propiedad (habitacional, comercial, industrial, mixto, etc.)..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
          <CardDescription>Agrega las características destacadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={caracteristica}
              onChange={(e) => setCaracteristica(e.target.value)}
              placeholder="Ej: Vista panorámica"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristica())}
            />
            <Button type="button" onClick={addCaracteristica}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.caracteristicas?.map((car, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full"
              >
                <span className="text-sm">{car}</span>
                <button
                  type="button"
                  onClick={() => removeCaracteristica(index)}
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenidades</CardTitle>
          <CardDescription>Selecciona las amenidades disponibles en la propiedad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenidadesDisponibles.map((amenidad) => (
              <button
                key={amenidad}
                type="button"
                onClick={() => toggleAmenidad(amenidad)}
                className={`
                  p-3 rounded-lg border text-sm font-medium transition-all text-left
                  ${amenidadesSeleccionadas.includes(amenidad)
                    ? 'bg-arkin-gold text-black border-arkin-gold shadow-md'
                    : 'bg-arkin-secondary/50 text-gray-600 border-gray-200 hover:border-arkin-gold/50 hover:bg-arkin-gold/5'
                  }
                `}
              >
                {amenidad}
              </button>
            ))}
          </div>
          {amenidadesSeleccionadas.length > 0 && (
            <p className="text-sm text-gray-500 mt-3">
              {amenidadesSeleccionadas.length} amenidad(es) seleccionada(s)
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagen Principal</CardTitle>
          <CardDescription>Sube la imagen principal de la propiedad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imagen">Imagen Principal *</Label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-arkin-gold/30 rounded-xl p-8 text-center bg-arkin-gold/5 hover:bg-arkin-gold/10 transition-colors">
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required={!initialData}
                />
                <label htmlFor="imagen" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-arkin-gold mx-auto mb-3" />
                  <p className="text-sm font-medium text-arkin-graphite mb-1">
                    Click para subir imagen
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG o WEBP (máx. 5MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-arkin-gold/20 group">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label htmlFor="imagen" className="cursor-pointer">
                    <input
                      type="file"
                      id="imagen"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button type="button" size="sm" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Cambiar
                      </span>
                    </Button>
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={removeImage}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Galería de Imágenes</CardTitle>
          <CardDescription>Sube hasta 10 imágenes adicionales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="galeria">Imágenes de la Galería</Label>

            <div className="border-2 border-dashed border-arkin-gold/30 rounded-xl p-8 text-center bg-arkin-gold/5 hover:bg-arkin-gold/10 transition-colors">
              <input
                type="file"
                id="galeria"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <label htmlFor="galeria" className="cursor-pointer">
                <div className="flex justify-center gap-2 mb-3">
                  <Upload className="h-12 w-12 text-arkin-gold" />
                  <Plus className="h-6 w-6 text-arkin-gold mt-6 -ml-4" />
                </div>
                <p className="text-sm font-medium text-arkin-graphite mb-1">
                  Click para subir múltiples imágenes
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG o WEBP (máx. 5MB cada una)
                </p>
              </label>
            </div>

            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-arkin-gold/20 group">
                    <img
                      src={preview}
                      alt={`Galería ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => removeGalleryImage(index)}
                        className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 p-0 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" className="bg-arkin-gold hover:bg-arkin-gold/90 text-black font-semibold">
          {initialData ? 'Actualizar' : 'Publicar'} Propiedad
        </Button>
      </div>
    </form>
  )
}

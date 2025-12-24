"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  ArrowLeft,
  Image as ImageIcon,
  Trash2,
  Eye,
  Download
} from "lucide-react"
import Image from "next/image"

interface Propiedad {
  id: number
  titulo: string
  ubicacion: string
  precio: number
  precio_texto: string
  imagenes?: string[]
}

export default function SubirImagenesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propiedadId = params.id as string

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null)
  const [imagenes, setImagenes] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'fotografo') {
      router.push('/login')
      return
    }
    loadPropiedad()
  }, [user, isAuthenticated, router, propiedadId])

  const loadPropiedad = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', propiedadId)
        .single()

      if (error) throw error
      setPropiedad(data)
      setImagenes(data.imagenes || [])
    } catch (error) {
      console.error('Error loading property:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    try {
      const uploadedUrls: string[] = []

      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${propiedadId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('propiedades')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('propiedades')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
      }

      // Update property with new images
      const newImagenes = [...imagenes, ...uploadedUrls]
      const { error: updateError } = await supabase
        .from('propiedades')
        .update({ imagenes: newImagenes })
        .eq('id', propiedadId)

      if (updateError) throw updateError

      setImagenes(newImagenes)
      setSelectedFiles([])
      setPreviewUrls([])
      alert('Imágenes subidas exitosamente')
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error al subir imágenes')
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (imageUrl: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return

    try {
      const newImagenes = imagenes.filter(img => img !== imageUrl)
      const { error } = await supabase
        .from('propiedades')
        .update({ imagenes: newImagenes })
        .eq('id', propiedadId)

      if (error) throw error

      setImagenes(newImagenes)
      alert('Imagen eliminada')
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error al eliminar imagen')
    }
  }

  if (!propiedad) return <div className="p-8">Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-arkin-graphite to-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => router.push('/panel-fotografo')}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-arkin-primary rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6 text-arkin-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{propiedad.titulo}</h1>
              <p className="text-gray-300">{propiedad.ubicacion}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-arkin-primary" />
              Subir Nuevas Imágenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-arkin-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Selecciona imágenes
                  </p>
                  <p className="text-sm text-gray-500">
                    Haz clic para seleccionar o arrastra imágenes aquí
                  </p>
                </label>
              </div>

              {/* Preview Selected Files */}
              {selectedFiles.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Imágenes seleccionadas ({selectedFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={uploadImages}
                    disabled={uploading}
                    className="w-full bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent"
                  >
                    {uploading ? 'Subiendo...' : `Subir ${selectedFiles.length} imagen${selectedFiles.length > 1 ? 'es' : ''}`}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing Images */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-arkin-primary" />
              Imágenes de la Propiedad ({imagenes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {imagenes.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Aún no hay imágenes para esta propiedad
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagenes.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => window.open(imageUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => deleteImage(imageUrl)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

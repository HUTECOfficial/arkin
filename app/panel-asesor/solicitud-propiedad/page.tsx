'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Send, Camera, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SolicitudPropiedadPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enviada, setEnviada] = useState(false)

  const [formData, setFormData] = useState({
    titulo: '',
    ubicacion: '',
    descripcion: '',
    precio_estimado: '',
    tipo: 'Departamento',
    categoria: 'venta',
    habitaciones: '',
    banos: '',
    area: ''
  })

  if (!isAuthenticated || user?.role !== 'asesor') {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo.trim()) {
      toast.error('El título es obligatorio')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/solicitudes-propiedad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asesor_email: user?.email,
          asesor_nombre: user?.nombre,
          titulo: formData.titulo,
          ubicacion: formData.ubicacion || null,
          descripcion: formData.descripcion || null,
          precio_estimado: formData.precio_estimado ? parseFloat(formData.precio_estimado) : null,
          tipo: formData.tipo,
          categoria: formData.categoria,
          habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : null,
          banos: formData.banos ? parseInt(formData.banos) : null,
          area: formData.area ? parseFloat(formData.area) : null
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar solicitud')
      }

      setEnviada(true)
      toast.success('Solicitud enviada al fotógrafo')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al enviar solicitud')
    } finally {
      setLoading(false)
    }
  }

  if (enviada) {
    return (
      <div className="min-h-screen bg-arkin-secondary flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-arkin-graphite mb-2">Solicitud Enviada</h2>
            <p className="text-gray-500 mb-2">
              Tu solicitud para <strong>{formData.titulo}</strong> ha sido enviada al fotógrafo.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Santiago recibirá la solicitud y se encargará de subir las fotos y completar la información de la propiedad.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setEnviada(false)
                  setFormData({
                    titulo: '', ubicacion: '', descripcion: '', precio_estimado: '',
                    tipo: 'Departamento', categoria: 'venta', habitaciones: '', banos: '', area: ''
                  })
                }}
                className="flex-1"
              >
                Nueva Solicitud
              </Button>
              <Button
                onClick={() => router.push('/panel-asesor')}
                className="flex-1 bg-arkin-gold hover:bg-arkin-gold/90 text-black"
              >
                Volver al Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arkin-secondary text-arkin-graphite p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/panel-asesor/propiedades')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Propiedades
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-arkin-graphite">
            Solicitar Propiedad
          </h1>
          <p className="text-gray-500 text-sm">
            Envía los datos básicos de la propiedad. El fotógrafo (Santiago) se encargará de subir las fotos y completar la publicación.
          </p>
        </div>

        {/* Info banner */}
        <Card className="mb-6 bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Camera className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700">¿Cómo funciona?</p>
              <p className="text-xs text-blue-600 mt-1">
                1. Llena los datos básicos de la propiedad → 2. Envía la solicitud → 3. Santiago recibe la solicitud → 4. Santiago sube las fotos y publica la propiedad
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Datos de la Propiedad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Título */}
              <div>
                <Label htmlFor="titulo" className="text-sm font-medium">
                  Título de la propiedad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Casa en Residencial La Valenciana"
                  className="mt-1"
                  required
                />
              </div>

              {/* Ubicación */}
              <div>
                <Label htmlFor="ubicacion" className="text-sm font-medium">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: León, Guanajuato"
                  className="mt-1"
                />
              </div>

              {/* Tipo y Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Departamento">Departamento</SelectItem>
                      <SelectItem value="Terreno">Terreno</SelectItem>
                      <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Bodega">Bodega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="renta">Renta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Precio */}
              <div>
                <Label htmlFor="precio" className="text-sm font-medium">Precio estimado (MXN)</Label>
                <Input
                  id="precio"
                  type="number"
                  value={formData.precio_estimado}
                  onChange={(e) => setFormData({ ...formData, precio_estimado: e.target.value })}
                  placeholder="Ej: 3500000"
                  className="mt-1"
                />
              </div>

              {/* Habitaciones, Baños, Área */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="habitaciones" className="text-sm font-medium">Habitaciones</Label>
                  <Input
                    id="habitaciones"
                    type="number"
                    value={formData.habitaciones}
                    onChange={(e) => setFormData({ ...formData, habitaciones: e.target.value })}
                    placeholder="3"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="banos" className="text-sm font-medium">Baños</Label>
                  <Input
                    id="banos"
                    type="number"
                    value={formData.banos}
                    onChange={(e) => setFormData({ ...formData, banos: e.target.value })}
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="area" className="text-sm font-medium">Área (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="150"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="descripcion" className="text-sm font-medium">Descripción / Notas para el fotógrafo</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe la propiedad, detalles importantes, dirección exacta para la sesión de fotos, horarios de acceso, contacto del propietario, etc."
                  className="mt-1 min-h-[120px]"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !formData.titulo.trim()}
                className="w-full bg-arkin-gold hover:bg-arkin-gold/90 text-black font-semibold py-6 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Enviar Solicitud al Fotógrafo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

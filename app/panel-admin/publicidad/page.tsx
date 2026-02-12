'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { AdsStorage, Ad } from '@/lib/ads-storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  MousePointer,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  LayoutGrid,
  Palette,
  Calendar,
  BarChart3,
  Power,
  PenLine,
} from 'lucide-react'

const ALLOWED_EMAILS = ['admin@arkin.mx', 'lizzie@arkin.mx']

export default function PublicidadPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    enlace: '',
    textoBoton: 'Ver más',
    ubicacion: 'entre-secciones' as Ad['ubicacion'],
    estilo: 'elegante' as Ad['estilo'],
    activo: true,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
  })

  useEffect(() => {
    if (!isAuthenticated || !user?.email || !ALLOWED_EMAILS.includes(user.email)) {
      router.push('/login')
      return
    }
    loadAds()
  }, [user, isAuthenticated, router])

  const loadAds = () => {
    setAds(AdsStorage.getAll())
  }

  const resetForm = () => {
    setForm({
      titulo: '',
      descripcion: '',
      imagen: '',
      enlace: '',
      textoBoton: 'Ver más',
      ubicacion: 'entre-secciones',
      estilo: 'elegante',
      activo: true,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = () => {
    if (!form.titulo.trim()) {
      toast.error('El título es obligatorio')
      return
    }

    if (editingId) {
      AdsStorage.update(editingId, {
        ...form,
        fechaInicio: form.fechaInicio ? new Date(form.fechaInicio).toISOString() : '',
        fechaFin: form.fechaFin ? new Date(form.fechaFin).toISOString() : '',
      })
      toast.success('Anuncio actualizado')
    } else {
      AdsStorage.add({
        ...form,
        fechaInicio: form.fechaInicio ? new Date(form.fechaInicio).toISOString() : '',
        fechaFin: form.fechaFin ? new Date(form.fechaFin).toISOString() : '',
        creadoPor: user?.email || '',
      })
      toast.success('Anuncio creado')
    }

    resetForm()
    loadAds()
  }

  const handleEdit = (ad: Ad) => {
    setForm({
      titulo: ad.titulo,
      descripcion: ad.descripcion,
      imagen: ad.imagen,
      enlace: ad.enlace,
      textoBoton: ad.textoBoton,
      ubicacion: ad.ubicacion,
      estilo: ad.estilo,
      activo: ad.activo,
      fechaInicio: ad.fechaInicio ? ad.fechaInicio.split('T')[0] : '',
      fechaFin: ad.fechaFin ? ad.fechaFin.split('T')[0] : '',
    })
    setEditingId(ad.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este anuncio?')) {
      AdsStorage.delete(id)
      loadAds()
      toast.success('Anuncio eliminado')
    }
  }

  const toggleActive = (id: string, activo: boolean) => {
    AdsStorage.update(id, { activo })
    loadAds()
  }

  const ubicacionLabels: Record<string, string> = {
    'banner-hero': 'Debajo del Hero',
    'entre-secciones': 'Entre Secciones',
    'lateral': 'Lateral',
    'footer': 'Antes del Footer',
  }

  const estiloLabels: Record<string, string> = {
    elegante: 'Elegante',
    destacado: 'Destacado (con imagen de fondo)',
    sutil: 'Sutil',
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/panel-admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-[#D4AF37]" />
                Publicidad
              </h1>
              <p className="text-gray-400">Gestiona los espacios publicitarios del homepage</p>
            </div>
            <Button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Anuncio
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-5 text-center">
              <p className="text-gray-400 text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{ads.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-5 text-center">
              <p className="text-gray-400 text-xs mb-1">Activos</p>
              <p className="text-2xl font-bold text-green-400">{ads.filter(a => a.activo).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-5 text-center">
              <p className="text-gray-400 text-xs mb-1">Impresiones</p>
              <p className="text-2xl font-bold text-blue-400">{ads.reduce((s, a) => s + a.impresiones, 0)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-5 text-center">
              <p className="text-gray-400 text-xs mb-1">Clicks</p>
              <p className="text-2xl font-bold text-[#D4AF37]">{ads.reduce((s, a) => s + a.clicks, 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="bg-[#1a1a1a] border-gray-800 mb-8">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PenLine className="h-5 w-5 text-[#D4AF37]" />
                {editingId ? 'Editar Anuncio' : 'Nuevo Anuncio'}
              </h2>

              <div className="space-y-6">
                {/* Título y Descripción */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Título del anuncio *</Label>
                    <Input
                      placeholder="Ej: Nuevo desarrollo en Polanco"
                      value={form.titulo}
                      onChange={(e) => setForm(prev => ({ ...prev, titulo: e.target.value }))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Texto del botón</Label>
                    <Input
                      placeholder="Ej: Ver más"
                      value={form.textoBoton}
                      onChange={(e) => setForm(prev => ({ ...prev, textoBoton: e.target.value }))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Descripción</Label>
                  <Textarea
                    placeholder="Describe el anuncio..."
                    rows={3}
                    value={form.descripcion}
                    onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                </div>

                {/* Imagen y Enlace */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" /> URL de imagen
                    </Label>
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={form.imagen}
                      onChange={(e) => setForm(prev => ({ ...prev, imagen: e.target.value }))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                    {form.imagen && (
                      <div className="mt-2 rounded-xl overflow-hidden h-32 bg-black/30">
                        <img src={form.imagen} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5" /> Enlace de destino
                    </Label>
                    <Input
                      placeholder="https://ejemplo.com"
                      value={form.enlace}
                      onChange={(e) => setForm(prev => ({ ...prev, enlace: e.target.value }))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Ubicación y Estilo */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <LayoutGrid className="h-3.5 w-3.5" /> Ubicación
                    </Label>
                    <Select
                      value={form.ubicacion}
                      onValueChange={(v) => setForm(prev => ({ ...prev, ubicacion: v as Ad['ubicacion'] }))}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner-hero">Debajo del Hero</SelectItem>
                        <SelectItem value="entre-secciones">Entre Secciones</SelectItem>
                        <SelectItem value="lateral">Lateral</SelectItem>
                        <SelectItem value="footer">Antes del Footer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5" /> Estilo
                    </Label>
                    <Select
                      value={form.estilo}
                      onValueChange={(v) => setForm(prev => ({ ...prev, estilo: v as Ad['estilo'] }))}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elegante">Elegante</SelectItem>
                        <SelectItem value="destacado">Destacado (imagen de fondo)</SelectItem>
                        <SelectItem value="sutil">Sutil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Estado</Label>
                    <div className="flex items-center gap-3 pt-2">
                      <Switch
                        checked={form.activo}
                        onCheckedChange={(v) => setForm(prev => ({ ...prev, activo: v }))}
                      />
                      <span className={form.activo ? 'text-green-400 text-sm' : 'text-gray-500 text-sm'}>
                        {form.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Fecha inicio
                    </Label>
                    <Input
                      type="date"
                      value={form.fechaInicio}
                      onChange={(e) => setForm(prev => ({ ...prev, fechaInicio: e.target.value }))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Fecha fin (opcional)
                    </Label>
                    <Input
                      type="date"
                      value={form.fechaFin}
                      onChange={(e) => setForm(prev => ({ ...prev, fechaFin: e.target.value }))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold px-8"
                  >
                    {editingId ? 'Guardar Cambios' : 'Crear Anuncio'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ads List */}
        <div className="space-y-4">
          {ads.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No hay anuncios creados</p>
                <p className="text-gray-500 text-sm">Crea tu primer anuncio para mostrarlo en el homepage</p>
              </CardContent>
            </Card>
          ) : (
            ads.map((ad) => (
              <Card key={ad.id} className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {ad.imagen && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
                        <img src={ad.imagen} alt={ad.titulo} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white truncate">{ad.titulo}</h3>
                        <Badge className={ad.activo
                          ? 'bg-green-500/20 text-green-400 border-green-500/50 text-xs'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/50 text-xs'
                        }>
                          {ad.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-[#D4AF37] border-[#D4AF37]/50">
                          {ubicacionLabels[ad.ubicacion] || ad.ubicacion}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {estiloLabels[ad.estilo] || ad.estilo}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 truncate mb-2">{ad.descripcion || 'Sin descripción'}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ad.impresiones} impresiones</span>
                        <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" />{ad.clicks} clicks</span>
                        <span>Por: {ad.creadoPor}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActive(ad.id, !ad.activo)}
                        className={ad.activo ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-400'}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(ad)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

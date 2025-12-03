'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PropertiesStorage } from '@/lib/properties-storage'
import { propiedades as mockPropiedades } from '@/data/propiedades'
import { Propiedad } from '@/data/propiedades'
import { PropertyForm } from '@/components/property-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  User
} from 'lucide-react'
import { toast } from 'sonner'

export default function PropiedadesAsesorPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Propiedad | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'asesor') {
      router.push('/login')
      return
    }

    // Inicializar con datos mock si está vacío
    PropertiesStorage.initializeWithMockData(mockPropiedades)

    // Cargar propiedades del asesor
    loadProperties()
  }, [user, isAuthenticated, router])

  const loadProperties = async () => {
    if (!user) return

    try {
      // Cargar TODAS las propiedades desde PropertiesStorage
      const allProperties = await PropertiesStorage.getAll()
      setPropiedades(allProperties)
    } catch (error) {
      console.error('Error in loadProperties:', error)
      setPropiedades([])
    }
  }

  const handleSubmit = async (data: Omit<Propiedad, 'id'>) => {
    if (!user) return

    try {
      if (editingProperty) {
        const updated = await PropertiesStorage.update(editingProperty.id, data)
        if (!updated) {
          throw new Error('No se pudo actualizar la propiedad. Verifica que tengas permisos.')
        }
        toast.success('Propiedad actualizada exitosamente')
      } else {
        // Usar el usuario del AuthContext
        if (!user) throw new Error('Usuario no autenticado')

        const newProperty = await PropertiesStorage.add(data, user.id)
        if (!newProperty) {
          throw new Error('No se pudo crear la propiedad')
        }
        toast.success('Propiedad publicada exitosamente')
      }

      await loadProperties()
      setShowForm(false)
      setEditingProperty(null)
    } catch (error: any) {
      console.error('Error guardando propiedad:', error)
      toast.error(error?.message || 'No se pudo guardar la propiedad')
    }
  }

  const handleEdit = (property: Propiedad) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    PropertiesStorage.delete(id)
    toast.success('Propiedad eliminada')
    loadProperties()
    setDeleteConfirm(null)
  }

  const handleNewProperty = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  if (!user) return null

  if (showForm) {
    return (
      <div className="min-h-screen bg-arkin-secondary text-arkin-graphite p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setShowForm(false)
              setEditingProperty(null)
            }}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-arkin-graphite">
              {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h1>
            <p className="text-gray-600">
              {editingProperty ? 'Actualiza la información de la propiedad' : 'Completa el formulario para publicar una nueva propiedad'}
            </p>
          </div>

          <PropertyForm
            initialData={editingProperty || undefined}
            asesorEmail={user.email}
            asesorNombre={user.nombre || ''}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingProperty(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arkin-secondary text-arkin-graphite p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={() => router.push('/panel-asesor')}
              className="mb-3 sm:mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-arkin-graphite">Mis Propiedades</h1>
            <p className="text-sm sm:text-base text-gray-600">Gestiona tu portafolio de propiedades</p>
          </div>
          <Button
            onClick={handleNewProperty}
            className="bg-arkin-gold hover:bg-arkin-gold/90 text-black font-semibold w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propiedad
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Propiedades</p>
                  <p className="text-2xl sm:text-3xl font-bold text-arkin-graphite">{propiedades.length}</p>
                </div>
                <div className="p-3 bg-arkin-gold/10 rounded-xl">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-arkin-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Disponibles</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {propiedades.filter(p => p.status === 'Disponible').length}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Exclusivas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-arkin-gold">
                    {propiedades.filter(p => p.status === 'Exclusiva').length}
                  </p>
                </div>
                <div className="p-3 bg-arkin-gold/10 rounded-xl">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-arkin-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Reservadas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {propiedades.filter(p => p.status === 'Reservada').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Propiedades */}
        {propiedades.length === 0 ? (
          <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-arkin-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-arkin-graphite">No tienes propiedades</h3>
              <p className="text-gray-600 mb-6">Comienza publicando tu primera propiedad</p>
              <Button
                onClick={handleNewProperty}
                className="bg-arkin-gold hover:bg-arkin-gold/90 text-black font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Publicar Primera Propiedad
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((propiedad) => (
              <Card key={propiedad.id} className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={propiedad.imagen}
                    alt={propiedad.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${propiedad.status === 'Disponible'
                      ? 'bg-green-500/20 text-green-700 border border-green-500/50'
                      : propiedad.status === 'Exclusiva'
                        ? 'bg-arkin-gold/20 text-arkin-gold border border-arkin-gold/50'
                        : 'bg-blue-500/20 text-blue-700 border border-blue-500/50'
                      }`}>
                      {propiedad.status}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-arkin-graphite">{propiedad.titulo}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{propiedad.ubicacion}</span>
                  </div>

                  {/* Información del Asesor */}
                  {propiedad.agente && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-arkin-gold/10 rounded-lg border border-arkin-gold/20">
                      <User className="h-4 w-4 text-arkin-gold" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Publicado por</span>
                        <span className="text-sm font-semibold text-arkin-graphite">{propiedad.agente.nombre}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-2xl font-bold text-arkin-gold mb-4">
                    {propiedad.precioTexto}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {propiedad.habitaciones}
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {propiedad.banos}
                    </div>
                    <div className="flex items-center">
                      <Maximize className="h-4 w-4 mr-1" />
                      {propiedad.areaTexto}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(propiedad)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>


                    {/* Editar: Solo propietario o admin */}
                    {(user?.role === 'admin' || (propiedad.agente && propiedad.agente.email === user?.email)) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(propiedad)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}

                    {/* Eliminar: SOLO admin */}
                    {user?.role === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(propiedad.id)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
        }

        {/* Dialog de Confirmación de Eliminación */}
        <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="bg-arkin-secondary/50 border-arkin-gold/20">
            <DialogHeader>
              <DialogTitle className="text-arkin-graphite">¿Eliminar propiedad?</DialogTitle>
              <DialogDescription className="text-gray-600">
                Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 justify-end mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div >
    </div >
  )
}

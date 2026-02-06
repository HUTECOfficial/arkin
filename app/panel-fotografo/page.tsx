"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Camera, 
  Video, 
  DollarSign, 
  Home, 
  CheckCircle, 
  Clock, 
  MapPin,
  Banknote,
  PiggyBank,
  LogOut,
  ImageOff,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  XCircle,
  Inbox,
  User,
  Bed,
  Bath,
  Maximize,
  FileText,
  ChevronRight,
  Eye
} from "lucide-react"

// Configuración de comisiones
const COMISION_ARKIN = 0.02
const COMISION_FOTOGRAFO = 0.135

function calcularComision(precioVenta: number) {
  const comisionArkin = precioVenta * COMISION_ARKIN
  const comisionFotografo = comisionArkin * COMISION_FOTOGRAFO
  return { comisionArkin, comisionFotografo }
}

interface PropiedadDB {
  id: number
  titulo: string
  ubicacion: string
  precio: number
  precio_texto: string
  imagen?: string
  galeria?: string[]
  status: string
  asesor_email?: string
  usuario_id?: string
}

interface SolicitudPropiedad {
  id: string
  asesor_email: string
  asesor_nombre?: string
  titulo: string
  ubicacion?: string
  descripcion?: string
  precio_estimado?: number
  tipo?: string
  categoria?: string
  habitaciones?: number
  banos?: number
  area?: number
  status: 'pendiente' | 'en_proceso' | 'completada' | 'rechazada'
  notas_fotografo?: string
  propiedad_id?: number
  created_at: string
  updated_at: string
}

export default function PanelFotografoPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [propiedades, setPropiedades] = useState<PropiedadDB[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudPropiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'solicitudes' | 'propiedades'>('solicitudes')
  const [solicitudDetalle, setSolicitudDetalle] = useState<SolicitudPropiedad | null>(null)
  const [notaFotografo, setNotaFotografo] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      router.push('/login')
    }
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'fotografo') {
      router.push('/login')
      return
    }
    loadData()
  }, [user, isAuthenticated, router])

  const loadData = async () => {
    setLoading(true)
    try {
      // Cargar TODAS las propiedades (Santi ve todo)
      const propRes = await fetch('/api/admin/propiedades')
      if (propRes.ok) {
        const propData = await propRes.json()
        setPropiedades(propData.propiedades || propData || [])
      }

      // Cargar solicitudes de asesores
      const solRes = await fetch('/api/solicitudes-propiedad?role=fotografo')
      if (solRes.ok) {
        const solData = await solRes.json()
        setSolicitudes(solData.solicitudes || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSolicitud = async (id: string, status: string, notas?: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/solicitudes-propiedad', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notas_fotografo: notas || undefined })
      })
      if (res.ok) {
        await loadData()
        setSolicitudDetalle(null)
        setNotaFotografo('')
      }
    } catch (error) {
      console.error('Error updating solicitud:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (!user) return null

  const solicitudesPendientes = solicitudes.filter(s => s.status === 'pendiente')
  const solicitudesEnProceso = solicitudes.filter(s => s.status === 'en_proceso')
  const totalPropiedades = propiedades.length
  const propiedadesConFotos = propiedades.filter((p: any) => (p.imagen || p.galeria?.length > 0)).length

  // Calcular comisiones
  const propiedadesVendidas = propiedades.filter(p => p.status === 'Vendida')
  const totalComisiones = propiedadesVendidas.reduce((sum, p) => {
    const { comisionFotografo } = calcularComision(p.precio || 0)
    return sum + comisionFotografo
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-arkin-dark to-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-arkin-gold rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Fotografía</h1>
                <p className="text-gray-300">{user.nombre || 'Santiago Canales'} - Fotógrafo & Videógrafo</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center relative">
                  <Inbox className="h-5 w-5 text-red-600" />
                  {solicitudesPendientes.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {solicitudesPendientes.length}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Solicitudes Pendientes</p>
                  <p className="text-lg font-bold text-red-600">{solicitudesPendientes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Propiedades</p>
                  <p className="text-lg font-bold text-blue-600">{totalPropiedades}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Camera className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Con Fotos</p>
                  <p className="text-lg font-bold text-green-600">{propiedadesConFotos}/{totalPropiedades}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-arkin-gold/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-arkin-gold" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Comisiones</p>
                  <p className="text-lg font-bold text-arkin-gold">
                    ${totalComisiones.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === 'solicitudes' ? 'default' : 'outline'}
            onClick={() => { setTab('solicitudes'); setSolicitudDetalle(null) }}
            className={tab === 'solicitudes' ? 'bg-arkin-gold hover:bg-arkin-gold/90 text-black' : ''}
          >
            <Inbox className="h-4 w-4 mr-2" />
            Solicitudes de Asesores
            {solicitudesPendientes.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {solicitudesPendientes.length}
              </span>
            )}
          </Button>
          <Button
            variant={tab === 'propiedades' ? 'default' : 'outline'}
            onClick={() => setTab('propiedades')}
            className={tab === 'propiedades' ? 'bg-arkin-gold hover:bg-arkin-gold/90 text-black' : ''}
          >
            <Home className="h-4 w-4 mr-2" />
            Todas las Propiedades ({totalPropiedades})
          </Button>
        </div>

        {/* Tab: Solicitudes */}
        {tab === 'solicitudes' && !solicitudDetalle && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-arkin-gold" />
                Solicitudes de Propiedades ({solicitudes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando solicitudes...</p>
                </div>
              ) : solicitudes.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin solicitudes</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Cuando un asesor envíe una solicitud de propiedad, aparecerá aquí para que subas las fotos.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {solicitudes.map((sol) => {
                    const statusConfig: Record<string, { color: string; text: string }> = {
                      pendiente: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', text: 'Pendiente' },
                      en_proceso: { color: 'bg-blue-100 text-blue-700 border-blue-300', text: 'En Proceso' },
                      completada: { color: 'bg-green-100 text-green-700 border-green-300', text: 'Completada' },
                      rechazada: { color: 'bg-red-100 text-red-700 border-red-300', text: 'Rechazada' }
                    }
                    const config = statusConfig[sol.status] || statusConfig.pendiente

                    return (
                      <div
                        key={sol.id}
                        onClick={() => { setSolicitudDetalle(sol); setNotaFotografo(sol.notas_fotografo || '') }}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-arkin-gold/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg truncate">{sol.titulo}</h3>
                              <Badge className={`${config.color} border text-xs`}>{config.text}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {sol.asesor_nombre || sol.asesor_email}
                              </span>
                              {sol.ubicacion && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {sol.ubicacion}
                                </span>
                              )}
                              <span>{new Date(sol.created_at).toLocaleDateString('es-MX')}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-arkin-gold transition-colors" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detalle de Solicitud */}
        {tab === 'solicitudes' && solicitudDetalle && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSolicitudDetalle(null)}>
              ← Volver a solicitudes
            </Button>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{solicitudDetalle.titulo}</CardTitle>
                  <Badge className={
                    solicitudDetalle.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 border' :
                    solicitudDetalle.status === 'en_proceso' ? 'bg-blue-100 text-blue-700 border-blue-300 border' :
                    solicitudDetalle.status === 'completada' ? 'bg-green-100 text-green-700 border-green-300 border' :
                    'bg-red-100 text-red-700 border-red-300 border'
                  }>
                    {solicitudDetalle.status === 'pendiente' ? 'Pendiente' :
                     solicitudDetalle.status === 'en_proceso' ? 'En Proceso' :
                     solicitudDetalle.status === 'completada' ? 'Completada' : 'Rechazada'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info del asesor */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-blue-700 mb-1">Solicitado por:</p>
                  <p className="text-blue-900 font-semibold">{solicitudDetalle.asesor_nombre || 'Sin nombre'}</p>
                  <p className="text-sm text-blue-600">{solicitudDetalle.asesor_email}</p>
                </div>

                {/* Datos de la propiedad */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {solicitudDetalle.ubicacion && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{solicitudDetalle.ubicacion}</span>
                    </div>
                  )}
                  {solicitudDetalle.tipo && (
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-gray-400" />
                      <span>{solicitudDetalle.tipo}</span>
                    </div>
                  )}
                  {solicitudDetalle.precio_estimado && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>${solicitudDetalle.precio_estimado.toLocaleString('es-MX')}</span>
                    </div>
                  )}
                  {solicitudDetalle.habitaciones && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="h-4 w-4 text-gray-400" />
                      <span>{solicitudDetalle.habitaciones} habitaciones</span>
                    </div>
                  )}
                  {solicitudDetalle.banos && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bath className="h-4 w-4 text-gray-400" />
                      <span>{solicitudDetalle.banos} baños</span>
                    </div>
                  )}
                  {solicitudDetalle.area && (
                    <div className="flex items-center gap-2 text-sm">
                      <Maximize className="h-4 w-4 text-gray-400" />
                      <span>{solicitudDetalle.area} m²</span>
                    </div>
                  )}
                </div>

                {/* Descripción / Notas del asesor */}
                {solicitudDetalle.descripcion && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Notas del asesor:
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">{solicitudDetalle.descripcion}</p>
                  </div>
                )}

                {/* Notas del fotógrafo */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tus notas:</p>
                  <Textarea
                    value={notaFotografo}
                    onChange={(e) => setNotaFotografo(e.target.value)}
                    placeholder="Agrega notas sobre la sesión de fotos, horarios, observaciones..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {solicitudDetalle.status === 'pendiente' && (
                    <>
                      <Button
                        onClick={() => updateSolicitud(solicitudDetalle.id, 'en_proceso', notaFotografo)}
                        disabled={updatingId === solicitudDetalle.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Aceptar y Comenzar
                      </Button>
                      <Button
                        onClick={() => updateSolicitud(solicitudDetalle.id, 'rechazada', notaFotografo)}
                        disabled={updatingId === solicitudDetalle.id}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  {solicitudDetalle.status === 'en_proceso' && (
                    <>
                      <Button
                        onClick={() => updateSolicitud(solicitudDetalle.id, 'completada', notaFotografo)}
                        disabled={updatingId === solicitudDetalle.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Completada
                      </Button>
                      <Button
                        onClick={() => updateSolicitud(solicitudDetalle.id, 'en_proceso', notaFotografo)}
                        disabled={updatingId === solicitudDetalle.id}
                        variant="outline"
                      >
                        Guardar Notas
                      </Button>
                    </>
                  )}
                  {(solicitudDetalle.status === 'completada' || solicitudDetalle.status === 'rechazada') && (
                    <Button
                      onClick={() => updateSolicitud(solicitudDetalle.id, 'en_proceso', notaFotografo)}
                      disabled={updatingId === solicitudDetalle.id}
                      variant="outline"
                    >
                      Reabrir Solicitud
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab: Todas las Propiedades */}
        {tab === 'propiedades' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-arkin-gold" />
                Todas las Propiedades ({totalPropiedades})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando propiedades...</p>
                </div>
              ) : propiedades.length === 0 ? (
                <div className="text-center py-12">
                  <ImageOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin propiedades</h3>
                  <p className="text-gray-500 text-sm">No hay propiedades registradas aún.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {propiedades.map((propiedad: any) => {
                    const tieneImagen = propiedad.imagen || (propiedad.galeria && propiedad.galeria.length > 0)
                    const numGaleria = propiedad.galeria?.length || 0
                    const asesor = propiedad.asesorEmail || propiedad.asesor_email || propiedad.usuarioId || propiedad.usuario_id || 'Sin asignar'

                    return (
                      <div
                        key={propiedad.id}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4 flex-1 min-w-0">
                            {/* Thumbnail */}
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                              {propiedad.imagen ? (
                                <img src={propiedad.imagen} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageOff className="h-8 w-8 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">{propiedad.titulo}</h3>
                                <Badge variant="secondary" className="text-xs">{propiedad.status || 'Disponible'}</Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {propiedad.ubicacion}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  {propiedad.precioTexto || propiedad.precio_texto || `$${(propiedad.precio || 0).toLocaleString('es-MX')}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {asesor}
                                </span>
                                <span className={`flex items-center gap-1 ${tieneImagen ? 'text-green-600' : 'text-red-500'}`}>
                                  <Camera className="h-3 w-3" />
                                  {tieneImagen ? `${numGaleria > 0 ? numGaleria + ' fotos' : 'Con imagen'}` : 'Sin fotos'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => router.push(`/panel-fotografo/propiedades/${propiedad.id}`)}
                            className="bg-arkin-gold hover:bg-arkin-gold/90 text-black"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Fotos
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resumen de Comisiones */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-arkin-gold" />
              Estructura de Comisiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-arkin-secondary/70 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Comisión ARKIN</p>
                <p className="text-3xl font-bold text-gray-900">2%</p>
                <p className="text-xs text-gray-400">del precio de venta</p>
              </div>
              <div className="text-center p-4 bg-arkin-gold/10 rounded-xl border-2 border-arkin-gold/30">
                <p className="text-sm text-gray-500 mb-1">Tu Comisión</p>
                <p className="text-3xl font-bold text-arkin-gold">13.5%</p>
                <p className="text-xs text-gray-400">de la comisión ARKIN</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Tu % del Total</p>
                <p className="text-3xl font-bold text-green-600">0.27%</p>
                <p className="text-xs text-gray-400">del precio de venta</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Ejemplo:</strong> Por una propiedad vendida en $5,000,000 MXN:
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span className="text-gray-600">Comisión ARKIN: <strong>$100,000</strong></span>
                <span className="text-emerald-600 font-bold">→ Tu comisión: $13,500</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

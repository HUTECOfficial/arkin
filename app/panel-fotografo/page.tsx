"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Camera, 
  Video, 
  DollarSign, 
  Home, 
  CheckCircle, 
  Clock, 
  Calendar,
  MapPin,
  Banknote,
  PiggyBank,
  LogOut,
  ImageOff,
  Upload,
  Image as ImageIcon,
  Plus,
  AlertCircle,
  XCircle
} from "lucide-react"

// Configuración de comisiones
const COMISION_ARKIN = 0.02 // 2% del precio de venta
const COMISION_FOTOGRAFO = 0.135 // 13.5% de la comisión de ARKIN

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
  imagenes?: string[]
  status: string
}

interface SolicitudFotografo {
  id: string
  titulo: string
  ubicacion: string
  descripcion?: string
  precio_estimado?: number
  imagenes: string[]
  status: 'pendiente' | 'aprobada' | 'rechazada'
  created_at: string
  notas_admin?: string
}

export default function PanelFotografoPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [propiedades, setPropiedades] = useState<PropiedadDB[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudFotografo[]>([])
  const [loading, setLoading] = useState(true)

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
    loadPropiedades()
  }, [user, isAuthenticated, router])

  const loadPropiedades = async () => {
    setLoading(true)
    try {
      // Cargar propiedades asignadas al fotógrafo (puede estar vacío si no hay campo fotografo_id)
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('fotografo_id', user?.id)
        .order('created_at', { ascending: false })
      
      // Si hay error, solo loguearlo pero continuar
      if (error) {
        console.warn('No se pudieron cargar propiedades:', error.message)
        setPropiedades([])
      } else {
        setPropiedades(data || [])
      }

      // Cargar solicitudes del fotógrafo
      const { data: solicitudesData, error: solicitudesError } = await supabase
        .from('solicitudes_fotografo')
        .select('*')
        .eq('fotografo_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (solicitudesError) {
        console.warn('No se pudieron cargar solicitudes:', solicitudesError.message)
        setSolicitudes([])
      } else {
        setSolicitudes(solicitudesData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setPropiedades([])
      setSolicitudes([])
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const propiedadesAsignadas = propiedades
  const fotosCompletadas = propiedades.filter(p => p.imagenes && p.imagenes.length > 0).length
  const videosCompletados = 0
  
  // Calcular comisiones de propiedades vendidas
  const propiedadesVendidas = propiedades.filter(p => p.status === 'Vendida')
  const totalComisiones = propiedadesVendidas.reduce((sum, p) => {
    const { comisionFotografo } = calcularComision(p.precio)
    return sum + comisionFotografo
  }, 0)
  
  const potencialComisiones = propiedades
    .filter(p => p.status !== 'Vendida')
    .reduce((sum, p) => {
      const { comisionFotografo } = calcularComision(p.precio)
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
                <p className="text-gray-300">Santiago Canales - Fotógrafo & Videógrafo</p>
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
        {/* Botón Nueva Solicitud */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/panel-fotografo/nueva-solicitud')}
            className="w-full sm:w-auto bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Solicitud de Propiedad
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Comisiones Ganadas</p>
                  <p className="text-lg font-bold text-green-600">
                    ${totalComisiones.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <PiggyBank className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Comisiones Pendientes</p>
                  <p className="text-lg font-bold text-orange-600">
                    ${potencialComisiones.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fotos Completadas</p>
                  <p className="text-lg font-bold text-blue-600">{fotosCompletadas}/{propiedadesAsignadas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Videos Completados</p>
                  <p className="text-lg font-bold text-purple-600">{videosCompletados}/{propiedadesAsignadas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de Comisiones */}
        <Card className="border-0 shadow-lg mb-8">
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

        {/* Mis Solicitudes */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-arkin-gold" />
              Mis Solicitudes ({solicitudes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando solicitudes...</p>
              </div>
            ) : solicitudes.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Sin solicitudes
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                  Aún no has enviado ninguna solicitud de propiedad.
                </p>
                <Button
                  onClick={() => router.push('/panel-fotografo/nueva-solicitud')}
                  className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Solicitud
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((solicitud) => {
                  const statusConfig = {
                    pendiente: { 
                      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                      icon: Clock,
                      text: 'Pendiente'
                    },
                    aprobada: { 
                      color: 'bg-green-100 text-green-700 border-green-300',
                      icon: CheckCircle,
                      text: 'Aprobada'
                    },
                    rechazada: { 
                      color: 'bg-red-100 text-red-700 border-red-300',
                      icon: XCircle,
                      text: 'Rechazada'
                    }
                  }
                  const config = statusConfig[solicitud.status]
                  const StatusIcon = config.icon

                  return (
                    <div 
                      key={solicitud.id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{solicitud.titulo}</h3>
                            <Badge className={`${config.color} border`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.text}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {solicitud.ubicacion}
                            </span>
                            {solicitud.precio_estimado && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${solicitud.precio_estimado.toLocaleString('es-MX')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span className="flex items-center gap-1 text-blue-600">
                              <ImageIcon className="h-4 w-4" />
                              {solicitud.imagenes.length} foto{solicitud.imagenes.length !== 1 ? 's' : ''}
                            </span>
                            <span className="text-gray-500">
                              {new Date(solicitud.created_at).toLocaleDateString('es-MX')}
                            </span>
                          </div>
                          {solicitud.notas_admin && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-900">
                                <strong>Nota del admin:</strong> {solicitud.notas_admin}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Propiedades */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-arkin-gold" />
              Propiedades Asignadas ({propiedadesAsignadas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando propiedades...</p>
              </div>
            ) : propiedadesAsignadas.length === 0 ? (
              <div className="text-center py-12">
                <ImageOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Sin propiedades asignadas
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Aún no tienes propiedades asignadas para fotografiar. 
                  Cuando el administrador te asigne una propiedad, aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {propiedadesAsignadas.map((propiedad) => {
                  const numImagenes = propiedad.imagenes?.length || 0
                  const { comisionFotografo } = calcularComision(propiedad.precio)
                  
                  return (
                    <div 
                      key={propiedad.id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{propiedad.titulo}</h3>
                            <Badge variant={propiedad.status === 'Vendida' ? 'default' : 'secondary'}>
                              {propiedad.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {propiedad.ubicacion}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {propiedad.precio_texto}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-blue-600">
                              <ImageIcon className="h-4 w-4" />
                              {numImagenes} imagen{numImagenes !== 1 ? 'es' : ''}
                            </span>
                            <span className="flex items-center gap-1 text-green-600">
                              <Banknote className="h-4 w-4" />
                              Comisión potencial: ${comisionFotografo.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push(`/panel-fotografo/propiedades/${propiedad.id}`)}
                          className="bg-arkin-primary hover:bg-arkin-primary/90 text-arkin-accent"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {numImagenes > 0 ? 'Gestionar' : 'Subir'} Fotos
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen Total */}
        <div className="mt-8 p-6 bg-gradient-to-r from-arkin-dark to-gray-900 rounded-2xl text-white">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total Propiedades</p>
              <p className="text-3xl font-bold">{propiedadesAsignadas.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Propiedades Vendidas</p>
              <p className="text-3xl font-bold text-green-400">0</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Comisiones Ganadas</p>
              <p className="text-3xl font-bold text-arkin-gold">
                ${totalComisiones.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

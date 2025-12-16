"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  ImageOff
} from "lucide-react"

// Configuración de comisiones
const COMISION_ARKIN = 0.02 // 2% del precio de venta
const COMISION_FOTOGRAFO = 0.135 // 13.5% de la comisión de ARKIN

function calcularComision(precioVenta: number) {
  const comisionArkin = precioVenta * COMISION_ARKIN
  const comisionFotografo = comisionArkin * COMISION_FOTOGRAFO
  return { comisionArkin, comisionFotografo }
}

export default function PanelFotografoPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'fotografo') {
      router.push('/login')
      return
    }
  }, [user, isAuthenticated, router])

  if (!user) return null

  // De momento no hay propiedades asignadas al fotógrafo
  // Esto se llenará cuando el admin asigne propiedades para fotografiar
  const propiedadesAsignadas: any[] = []
  
  // Estadísticas (todas en 0 porque no hay contenido aún)
  const totalComisiones = 0
  const potencialComisiones = 0
  const fotosCompletadas = 0
  const videosCompletados = 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-arkin-dark to-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-arkin-gold rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel de Fotografía</h1>
              <p className="text-gray-300">Santiago Canales - Fotógrafo & Videógrafo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
                <span className="text-arkin-gold font-bold">→ Tu comisión: $13,500</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Propiedades */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-arkin-gold" />
              Propiedades Asignadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {propiedadesAsignadas.length === 0 ? (
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
                {/* Las propiedades se mostrarán aquí cuando sean asignadas */}
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

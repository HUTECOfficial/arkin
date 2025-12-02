"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Camera, 
  Video, 
  DollarSign, 
  Home, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  MapPin,
  Eye,
  FileText,
  ArrowRight,
  Banknote,
  PiggyBank,
  Target
} from "lucide-react"
import Image from "next/image"

// Datos de ejemplo - En producción vendrían de Supabase
const propiedadesAsignadas = [
  {
    id: 1,
    titulo: "Casa Residencial en Lomas",
    ubicacion: "Lomas del Campestre, León",
    precio: 4500000,
    imagen: "/luxury-villa-santa-fe.png",
    estadoFoto: "completado", // pendiente, en_proceso, completado
    estadoVideo: "completado",
    estadoVenta: "vendida", // disponible, en_negociacion, vendida
    fechaAsignacion: "2024-11-15",
    fechaVenta: "2024-12-01",
  },
  {
    id: 2,
    titulo: "Departamento de Lujo Polanco",
    ubicacion: "Polanco, CDMX",
    precio: 8500000,
    imagen: "/luxury-penthouse-polanco-main.png",
    estadoFoto: "completado",
    estadoVideo: "en_proceso",
    estadoVenta: "en_negociacion",
    fechaAsignacion: "2024-11-20",
    fechaVenta: null,
  },
  {
    id: 3,
    titulo: "Terreno Premium Santa Fe",
    ubicacion: "Santa Fe, CDMX",
    precio: 12000000,
    imagen: "/placeholder.jpg",
    estadoFoto: "completado",
    estadoVideo: "completado",
    estadoVenta: "vendida",
    fechaAsignacion: "2024-10-05",
    fechaVenta: "2024-11-28",
  },
  {
    id: 4,
    titulo: "Casa Moderna Condesa",
    ubicacion: "Condesa, CDMX",
    precio: 6200000,
    imagen: "/modern-apartment-roma-norte.png",
    estadoFoto: "en_proceso",
    estadoVideo: "pendiente",
    estadoVenta: "disponible",
    fechaAsignacion: "2024-11-28",
    fechaVenta: null,
  },
  {
    id: 5,
    titulo: "Penthouse Vista al Parque",
    ubicacion: "Bosques de las Lomas, CDMX",
    precio: 15000000,
    imagen: "/luxury-penthouse-polanco-main.png",
    estadoFoto: "pendiente",
    estadoVideo: "pendiente",
    estadoVenta: "disponible",
    fechaAsignacion: "2024-12-01",
    fechaVenta: null,
  }
]

// Configuración de comisiones
const COMISION_ARKIN = 0.02 // 2% del precio de venta
const COMISION_FOTOGRAFO = 0.135 // 13.5% de la comisión de ARKIN

function calcularComision(precioVenta: number) {
  const comisionArkin = precioVenta * COMISION_ARKIN
  const comisionFotografo = comisionArkin * COMISION_FOTOGRAFO
  return { comisionArkin, comisionFotografo }
}

function getEstadoBadge(estado: string, tipo: "foto" | "video" | "venta") {
  const colores = {
    pendiente: "bg-gray-100 text-gray-700",
    en_proceso: "bg-yellow-100 text-yellow-700",
    completado: "bg-green-100 text-green-700",
    disponible: "bg-blue-100 text-blue-700",
    en_negociacion: "bg-orange-100 text-orange-700",
    vendida: "bg-green-100 text-green-700",
  }
  
  const textos = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    completado: "Completado",
    disponible: "Disponible",
    en_negociacion: "En Negociación",
    vendida: "Vendida",
  }
  
  return (
    <Badge className={colores[estado as keyof typeof colores] || colores.pendiente}>
      {textos[estado as keyof typeof textos] || estado}
    </Badge>
  )
}

export default function PanelFotografoPage() {
  // Calcular estadísticas
  const propiedadesVendidas = propiedadesAsignadas.filter(p => p.estadoVenta === "vendida")
  const totalVentas = propiedadesVendidas.reduce((acc, p) => acc + p.precio, 0)
  const { comisionFotografo: totalComisiones } = calcularComision(totalVentas)
  
  const fotosCompletadas = propiedadesAsignadas.filter(p => p.estadoFoto === "completado").length
  const videosCompletados = propiedadesAsignadas.filter(p => p.estadoVideo === "completado").length
  const enNegociacion = propiedadesAsignadas.filter(p => p.estadoVenta === "en_negociacion").length
  
  // Comisiones pendientes (propiedades en negociación)
  const propiedadesEnNegociacion = propiedadesAsignadas.filter(p => p.estadoVenta === "en_negociacion")
  const potencialComisiones = propiedadesEnNegociacion.reduce((acc, p) => {
    const { comisionFotografo } = calcularComision(p.precio)
    return acc + comisionFotografo
  }, 0)

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
              <div className="text-center p-4 bg-gray-50 rounded-xl">
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
            <div className="space-y-4">
              {propiedadesAsignadas.map((propiedad) => {
                const { comisionFotografo } = calcularComision(propiedad.precio)
                const progreso = 
                  (propiedad.estadoFoto === "completado" ? 25 : propiedad.estadoFoto === "en_proceso" ? 12.5 : 0) +
                  (propiedad.estadoVideo === "completado" ? 25 : propiedad.estadoVideo === "en_proceso" ? 12.5 : 0) +
                  (propiedad.estadoVenta === "vendida" ? 50 : propiedad.estadoVenta === "en_negociacion" ? 25 : 0)
                
                return (
                  <div 
                    key={propiedad.id} 
                    className={`p-4 rounded-xl border ${
                      propiedad.estadoVenta === "vendida" 
                        ? "bg-green-50 border-green-200" 
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Imagen */}
                      <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={propiedad.imagen}
                          alt={propiedad.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{propiedad.titulo}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {propiedad.ubicacion}
                            </div>
                            <p className="text-lg font-bold text-arkin-gold mt-1">
                              ${propiedad.precio.toLocaleString('es-MX')}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Tu comisión potencial</p>
                            <p className={`text-lg font-bold ${
                              propiedad.estadoVenta === "vendida" ? "text-green-600" : "text-gray-400"
                            }`}>
                              ${comisionFotografo.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                              {propiedad.estadoVenta === "vendida" && (
                                <CheckCircle className="inline ml-1 h-4 w-4" />
                              )}
                            </p>
                          </div>
                        </div>
                        
                        {/* Estados */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div className="flex items-center gap-1">
                            <Camera className="h-3 w-3 text-gray-400" />
                            {getEstadoBadge(propiedad.estadoFoto, "foto")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-3 w-3 text-gray-400" />
                            {getEstadoBadge(propiedad.estadoVideo, "video")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3 text-gray-400" />
                            {getEstadoBadge(propiedad.estadoVenta, "venta")}
                          </div>
                        </div>
                        
                        {/* Progreso */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso</span>
                            <span>{progreso}%</span>
                          </div>
                          <Progress value={progreso} className="h-2" />
                        </div>
                        
                        {/* Fechas */}
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Asignado: {propiedad.fechaAsignacion}
                          </span>
                          {propiedad.fechaVenta && (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Vendido: {propiedad.fechaVenta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
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
              <p className="text-3xl font-bold text-green-400">{propiedadesVendidas.length}</p>
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

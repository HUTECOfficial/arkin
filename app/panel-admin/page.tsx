'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { users, propertyProgress, leads, activities } from '@/data/internal-users'
import { propiedades } from '@/data/propiedades'
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  FileText,
  LogOut,
  UserCircle,
  BarChart3,
  Settings,
  Home,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ClipboardList
} from 'lucide-react'
import { OwnerSubmissionsStorage } from '@/lib/owner-submissions-storage'

export default function PanelAdminPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'team' | 'leads'>('overview')

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [user, isAuthenticated, router])

  if (!user) return null

  const totalLeads = leads.length
  const totalPropiedades = propiedades.length
  const totalAsesores = users.filter(u => u.role === 'asesor').length
  const totalOfertas = propertyProgress.reduce((sum, p) => sum + p.ofertas, 0)
  const totalVisitas = propertyProgress.reduce((sum, p) => sum + p.visitas, 0)
  const submissionsStats = OwnerSubmissionsStorage.getStats()

  const propiedadesActivas = propertyProgress.filter(p => p.status === 'activa').length
  const propiedadesEnNegociacion = propertyProgress.filter(p => p.status === 'en_negociacion').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'en_negociacion': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'vendida': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'rentada': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-arkin-gold/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-arkin-gold" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.nombre} • Admin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/panel-admin/propiedades')}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-semibold border border-red-200"
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Gestionar Propiedades</span>
              </button>
              <button
                onClick={() => router.push('/panel-admin/solicitudes')}
                className="flex items-center gap-2 px-4 py-2 bg-arkin-gold hover:bg-arkin-gold/90 text-black rounded-xl transition-all font-semibold relative"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Solicitudes</span>
                {submissionsStats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {submissionsStats.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'overview'
                ? 'bg-arkin-gold text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            Vista General
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'properties'
                ? 'bg-arkin-gold text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <Home className="w-4 h-4" />
            Propiedades
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'team'
                ? 'bg-arkin-gold text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <Users className="w-4 h-4" />
            Equipo
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'leads'
                ? 'bg-arkin-gold text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <FileText className="w-4 h-4" />
            Leads
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Propiedades</span>
                  <Building2 className="w-5 h-5 text-arkin-gold" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalPropiedades}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {propiedadesActivas} activas • {propiedadesEnNegociacion} en negociación
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Total Leads</span>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalLeads}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {leads.filter(l => l.status === 'nuevo').length} nuevos
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Visitas</span>
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalVisitas}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Programadas este mes
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Ofertas</span>
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalOfertas}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  En proceso
                </p>
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-arkin-gold" />
                  Actividad Reciente del Equipo
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activities.slice(0, 10).map((activity) => {
                    const propiedad = propiedades.find(p => p.id === activity.propiedadId)
                    const asesor = users.find(u => u.id === activity.asesorId)
                    if (!propiedad || !asesor) return null

                    const getActivityIcon = () => {
                      switch (activity.tipo) {
                        case 'lead': return <Users className="w-4 h-4 text-blue-500" />
                        case 'visita': return <Eye className="w-4 h-4 text-green-500" />
                        case 'oferta': return <DollarSign className="w-4 h-4 text-purple-500" />
                        case 'venta': return <CheckCircle2 className="w-4 h-4 text-green-600" />
                        case 'nota': return <FileText className="w-4 h-4 text-gray-500" />
                      }
                    }

                    return (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          {getActivityIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {activity.descripcion}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {propiedad.titulo} • {asesor.nombre}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDate(activity.fecha)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Performance por Asesor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-arkin-gold" />
                  Performance del Equipo
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {users.filter(u => u.role === 'asesor').map((asesor) => {
                    const asesorProgress = propertyProgress.filter(p => p.asesorId === asesor.id)
                    const asesorLeads = leads.filter(l => l.asesorId === asesor.id)
                    const totalLeadsAsesor = asesorProgress.reduce((sum, p) => sum + p.leads, 0)
                    const totalVisitasAsesor = asesorProgress.reduce((sum, p) => sum + p.visitas, 0)
                    const totalOfertasAsesor = asesorProgress.reduce((sum, p) => sum + p.ofertas, 0)

                    return (
                      <div key={asesor.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-arkin-gold/10 rounded-xl flex items-center justify-center">
                              <UserCircle className="w-6 h-6 text-arkin-gold" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {asesor.nombre}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {asesorProgress.length} propiedades asignadas
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLeadsAsesor}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVisitasAsesor}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Visitas</p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOfertasAsesor}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Ofertas</p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {totalVisitasAsesor > 0 ? Math.round((totalOfertasAsesor / totalVisitasAsesor) * 100) : 0}%
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Conversión</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-arkin-gold" />
                Todas las Propiedades
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {propiedades.map((propiedad) => {
                  const progress = propertyProgress.find(p => p.propiedadId === propiedad.id)
                  const asesor = progress ? users.find(u => u.id === progress.asesorId) : null

                  return (
                    <div key={propiedad.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {propiedad.titulo}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {propiedad.ubicacion} • {propiedad.precioTexto}
                          </p>
                          {asesor && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Asesor: {asesor.nombre}
                            </p>
                          )}
                        </div>
                        {progress && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(progress.status)}`}>
                            {progress.status.replace('_', ' ')}
                          </span>
                        )}
                      </div>

                      {progress && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{progress.leads}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{progress.visitas}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Visitas</p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{progress.ofertas}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Ofertas</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-arkin-gold" />
                Equipo de Asesores
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.filter(u => u.role === 'asesor').map((asesor) => {
                  const asesorProgress = propertyProgress.filter(p => p.asesorId === asesor.id)
                  const asesorLeads = leads.filter(l => l.asesorId === asesor.id)

                  return (
                    <div key={asesor.id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-arkin-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <UserCircle className="w-8 h-8 text-arkin-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {asesor.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {asesor.email}
                          </p>
                          {asesor.telefono && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              <span>{asesor.telefono}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {asesorProgress.length}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Propiedades</p>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {asesorLeads.length}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {asesorProgress.reduce((sum, p) => sum + p.ofertas, 0)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Ofertas</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-arkin-gold" />
                Todos los Leads
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {leads.map((lead) => {
                  const propiedad = propiedades.find(p => p.id === lead.propiedadId)
                  const asesor = users.find(u => u.id === lead.asesorId)
                  if (!propiedad || !asesor) return null

                  const getLeadStatusColor = (status: string) => {
                    switch (status) {
                      case 'nuevo': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      case 'contactado': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      case 'calificado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      case 'descartado': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }
                  }

                  return (
                    <div key={lead.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {lead.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {propiedad.titulo}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Asesor: {asesor.nombre}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeadStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        "{lead.mensaje}"
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${lead.telefono}`} className="hover:text-arkin-gold transition-colors">
                            {lead.telefono}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${lead.email}`} className="hover:text-arkin-gold transition-colors">
                            {lead.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(lead.fecha)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

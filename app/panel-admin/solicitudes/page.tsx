'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { OwnerSubmissionsStorage, OwnerSubmission } from '@/lib/owner-submissions-storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2
} from 'lucide-react'

export default function SolicitudesPropietariosPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<OwnerSubmission[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    approved: 0,
    rejected: 0
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }

    loadSubmissions()
  }, [user, isAuthenticated, router])

  const loadSubmissions = () => {
    const allSubmissions = OwnerSubmissionsStorage.getAll()
    setSubmissions(allSubmissions)
    setStats(OwnerSubmissionsStorage.getStats())
  }

  const updateStatus = (id: string, status: OwnerSubmission['status']) => {
    OwnerSubmissionsStorage.updateStatus(id, status)
    loadSubmissions()
  }

  const deleteSubmission = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta solicitud?')) {
      OwnerSubmissionsStorage.delete(id)
      loadSubmissions()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/50">Pendiente</Badge>
      case 'contacted':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/50">Contactado</Badge>
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/50">Aprobado</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/50">Rechazado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.-]+/g, ''))
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-3xl font-bold mb-2">Solicitudes de Propietarios</h1>
          <p className="text-gray-400">Gestiona las solicitudes de registro de propiedades</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Contactados</p>
                <p className="text-3xl font-bold text-blue-500">{stats.contacted}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Aprobados</p>
                <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Rechazados</p>
                <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs por Estado */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-[#1a1a1a] border border-gray-800">
            <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pendientes ({stats.pending})</TabsTrigger>
            <TabsTrigger value="contacted">Contactados ({stats.contacted})</TabsTrigger>
            <TabsTrigger value="approved">Aprobados ({stats.approved})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {submissions.length === 0 ? (
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-12 text-center">
                  <Home className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay solicitudes registradas</p>
                </CardContent>
              </Card>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className="bg-[#1a1a1a] border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{submission.propertyType}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(submission.submittedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#D4AF37]">
                          {formatCurrency(submission.askingPrice)}
                        </p>
                        {submission.estimatedValue && (
                          <p className="text-sm text-gray-400">
                            Est: {formatCurrency(submission.estimatedValue.toString())}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-400">Ubicación</p>
                        <p className="font-semibold">{submission.neighborhood}, {submission.city}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Área</p>
                        <p className="font-semibold">{submission.area} m²</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Habitaciones</p>
                        <p className="font-semibold">{submission.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Baños</p>
                        <p className="font-semibold">{submission.bathrooms}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Propietario</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {submission.ownerName}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {submission.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {submission.email}
                        </div>
                      </div>
                    </div>

                    {submission.amenities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">Amenidades</p>
                        <div className="flex flex-wrap gap-2">
                          {submission.amenities.slice(0, 5).map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {submission.amenities.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{submission.amenities.length - 5} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(submission.id, 'contacted')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Marcar Contactado
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(submission.id, 'approved')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(submission.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      {submission.status === 'contacted' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(submission.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSubmission(submission.id)}
                        className="ml-auto text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending">
            {OwnerSubmissionsStorage.getByStatus('pending').map((submission) => (
              <Card key={submission.id} className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-6">
                  {/* Same content as above */}
                  <p className="text-yellow-500">Solicitud pendiente de revisión</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="contacted">
            {OwnerSubmissionsStorage.getByStatus('contacted').map((submission) => (
              <Card key={submission.id} className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-6">
                  <p className="text-blue-500">Propietario contactado</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved">
            {OwnerSubmissionsStorage.getByStatus('approved').map((submission) => (
              <Card key={submission.id} className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-6">
                  <p className="text-green-500">Solicitud aprobada</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

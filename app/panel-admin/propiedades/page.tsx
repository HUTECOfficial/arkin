'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Trash2, Eye, ArrowLeft, AlertTriangle } from 'lucide-react'
import { PropertiesStorage } from '@/lib/properties-storage'
import { Propiedad } from '@/data/propiedades'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export default function AdminPropiedadesPage() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()
    const [propiedades, setPropiedades] = useState<Propiedad[]>([])
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login')
            return
        }

        loadProperties()
    }, [user, isAuthenticated, router])

    const loadProperties = async () => {
        try {
            const { data, error } = await supabase
                .from('propiedades')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error loading properties:', error)
                setPropiedades([])
                return
            }

            const properties = data.map(PropertiesStorage.dbToApp)
            setPropiedades(properties)
        } catch (error) {
            console.error('Error in loadProperties:', error)
            setPropiedades([])
        }
    }

    const handleDelete = async (id: number) => {
        console.log('🗑️ Intentando eliminar propiedad ID:', id)
        try {
            console.log('Llamando a PropertiesStorage.delete...')
            const result = await PropertiesStorage.delete(id)
            console.log('Resultado de eliminación:', result)

            if (result) {
                toast.success('Propiedad eliminada exitosamente')
                await loadProperties()
                setDeleteConfirm(null)
            } else {
                toast.error('No se pudo eliminar la propiedad. Verifica tus permisos.')
            }
        } catch (error: any) {
            console.error('❌ Error eliminando propiedad:', error)
            console.error('Detalles del error:', error.message)
            toast.error(error.message || 'No se pudo eliminar la propiedad')
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-arkin-secondary text-arkin-graphite p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/panel-admin')}
                            className="mb-3 sm:mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al Panel Admin
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-arkin-graphite">
                            Gestión de Propiedades
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Administra todas las propiedades del sistema
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                        Total Propiedades
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-arkin-graphite">
                                        {propiedades.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-arkin-gold/10 rounded-xl">
                                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-arkin-gold" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                        Disponibles
                                    </p>
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

                    <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                        Exclusivas
                                    </p>
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

                    <Card className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                        Reservadas
                                    </p>
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
                            <h3 className="text-xl font-semibold mb-2 text-arkin-graphite">
                                No hay propiedades
                            </h3>
                            <p className="text-gray-600">
                                No se encontraron propiedades en el sistema
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {propiedades.map((propiedad) => (
                            <Card
                                key={propiedad.id}
                                className="bg-arkin-secondary/60 backdrop-blur-xl border-white/40 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Imagen */}
                                        <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={propiedad.imagen}
                                                alt={propiedad.titulo}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Información */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-arkin-graphite mb-1">
                                                        {propiedad.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{propiedad.ubicacion}</p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${propiedad.status === 'Disponible'
                                                        ? 'bg-green-500/20 text-green-700 border border-green-500/50'
                                                        : propiedad.status === 'Exclusiva'
                                                            ? 'bg-arkin-gold/20 text-arkin-gold border border-arkin-gold/50'
                                                            : 'bg-blue-500/20 text-blue-700 border border-blue-500/50'
                                                        }`}
                                                >
                                                    {propiedad.status}
                                                </span>
                                            </div>

                                            {propiedad.agente && (
                                                <div className="mb-3 text-sm text-gray-600">
                                                    <span className="font-semibold">Publicado por:</span>{' '}
                                                    {propiedad.agente.nombre} ({propiedad.agente.email})
                                                </div>
                                            )}

                                            <p className="text-2xl font-bold text-arkin-gold mb-3">
                                                {propiedad.precioTexto}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                <span>🛏️ {propiedad.habitaciones} hab</span>
                                                <span>🚿 {propiedad.banos} baños</span>
                                                <span>📐 {propiedad.areaTexto}</span>
                                            </div>

                                            {/* Botón de eliminar */}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirm(propiedad.id)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar Propiedad
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal de confirmación de eliminación */}
                {deleteConfirm !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-md w-full">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <CardTitle>Confirmar Eliminación</CardTitle>
                                </div>
                                <CardDescription>
                                    ¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede
                                    deshacer.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Eliminar
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { supabase } from '@/lib/supabase/client'
import type { Propiedad } from '@/data/propiedades'

// Fetcher para cargar propiedades desde Supabase con nombre del asesor
const fetchPropertiesFromSupabase = async (): Promise<Propiedad[]> => {
  try {
    // Primero obtener las propiedades
    const { data: propiedades, error: propError } = await supabase
      .from('propiedades')
      .select('*')
      .order('created_at', { ascending: false })

    if (propError) {
      console.error('Error fetching properties from Supabase:', propError)
      return []
    }

    // Obtener los IDs de usuarios únicos
    const usuarioIds = [...new Set((propiedades || [])
      .map((p: any) => p.usuario_id)
      .filter(Boolean))]

    // Obtener nombres de usuarios si hay IDs
    let usuariosMap: Record<string, string> = {}
    if (usuarioIds.length > 0) {
      const { data: usuarios } = await supabase
        .from('usuarios')
        .select('id, nombre')
        .in('id', usuarioIds)

      if (usuarios) {
        usuariosMap = usuarios.reduce((acc: Record<string, string>, u: any) => {
          acc[u.id] = u.nombre
          return acc
        }, {})
      }
    }

    return (propiedades || []).map((prop: any) => ({
      id: Number(prop.id),
      titulo: prop.titulo,
      ubicacion: prop.ubicacion,
      precio: Number(prop.precio),
      precioTexto: prop.precio_texto,
      tipo: prop.tipo,
      habitaciones: prop.habitaciones,
      banos: prop.banos,
      area: prop.area,
      areaTexto: prop.area_texto,
      imagen: prop.imagen || '',
      descripcion: prop.descripcion || '',
      caracteristicas: prop.caracteristicas || [],
      status: prop.status,
      categoria: prop.categoria,
      fechaPublicacion: prop.fecha_publicacion,
      tourVirtual: prop.tour_virtual || undefined,
      galeria: prop.galeria || undefined,
      agente: prop.usuario_id && usuariosMap[prop.usuario_id] ? {
        nombre: usuariosMap[prop.usuario_id],
        especialidad: 'Especialista en Propiedades',
        rating: 5.0,
        ventas: 0,
        telefono: '',
        email: '',
      } : undefined,
    }))
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export function usePropertiesStatic() {
  const [realtimeUpdates, setRealtimeUpdates] = useState<Map<number, Propiedad>>(new Map())

  // Cargar datos desde Supabase con SWR
  const { data: supabaseProperties = [], isLoading, error, mutate } = useSWR(
    'properties-supabase',
    fetchPropertiesFromSupabase,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 segundos
      focusThrottleInterval: 300000, // 5 minutos
    }
  )

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel('propiedades_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'propiedades' },
        async (payload) => {
          console.log('🔄 Realtime update received:', payload.eventType)

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newProp = payload.new as any
            const formattedProp: Propiedad = {
              id: Number(newProp.id),
              titulo: newProp.titulo,
              ubicacion: newProp.ubicacion,
              precio: Number(newProp.precio),
              precioTexto: newProp.precio_texto,
              tipo: newProp.tipo,
              habitaciones: newProp.habitaciones,
              banos: newProp.banos,
              area: newProp.area,
              areaTexto: newProp.area_texto,
              imagen: newProp.imagen || '',
              descripcion: newProp.descripcion || '',
              caracteristicas: newProp.caracteristicas || [],
              status: newProp.status,
              categoria: newProp.categoria,
              fechaPublicacion: newProp.fecha_publicacion,
              tourVirtual: newProp.tour_virtual || undefined,
              galeria: newProp.galeria || undefined,
            }

            setRealtimeUpdates((prev) => {
              const updated = new Map(prev)
              updated.set(newProp.id, formattedProp)
              return updated
            })
            
            // Revalidar datos de SWR para sincronizar
            mutate()
          } else if (payload.eventType === 'DELETE') {
            setRealtimeUpdates((prev) => {
              const updated = new Map(prev)
              updated.delete(payload.old.id)
              return updated
            })
            mutate()
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [mutate])

  // Combinar datos de Supabase con actualizaciones en tiempo real
  const properties = supabaseProperties.map((prop) => realtimeUpdates.get(prop.id) || prop)

  // Agregar nuevas propiedades que llegaron por realtime
  const allProperties = [
    ...properties,
    ...Array.from(realtimeUpdates.values()).filter(
      (prop) => !supabaseProperties.find((p) => p.id === prop.id)
    ),
  ]

  return {
    properties: allProperties,
    isLoading,
    error,
    refresh: () => mutate(),
    realtimeCount: realtimeUpdates.size,
  }
}

// Hook para obtener una propiedad específica
export function usePropertyStatic(id: number) {
  const { properties, isLoading } = usePropertiesStatic()
  const property = properties.find((p) => p.id === id)

  return {
    property,
    isLoading,
  }
}

// Hook para obtener propiedades por categoría
export function usePropertiesByCategory(categoria: string) {
  const { properties, isLoading } = usePropertiesStatic()
  const filtered = properties.filter((p) => p.categoria === categoria)

  return {
    properties: filtered,
    isLoading,
  }
}

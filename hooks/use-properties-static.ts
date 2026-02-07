import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { Propiedad } from '@/data/propiedades'

// Singleton para queries de datos (sin persistSession para evitar conflictos con auth)
let _queryClient: ReturnType<typeof createClient> | null = null
function getQueryClient() {
  if (!_queryClient) {
    _queryClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    )
  }
  return _queryClient
}

// Fetcher para cargar propiedades desde Supabase con nombre del asesor
const fetchPropertiesFromSupabase = async (): Promise<Propiedad[]> => {
  try {
    const db = getQueryClient()

    // Obtener propiedades SIN las imágenes pesadas para carga rápida
    const { data: propiedades, error: propError } = await db
      .from('propiedades')
      .select('id, titulo, ubicacion, precio, precio_texto, tipo, habitaciones, banos, area, area_texto, descripcion, caracteristicas, status, categoria, fecha_publicacion, tour_virtual, usuario_id, created_at')
      .order('created_at', { ascending: false })

    if (propError) {
      console.error('Error fetching properties from Supabase:', propError)
      return []
    }

    // Obtener solo las imágenes principales (sin galería) en consulta separada
    const propIds = (propiedades || []).map((p: any) => p.id)
    let imagenesMap: Record<number, string> = {}
    
    if (propIds.length > 0) {
      const { data: imagenes } = await db
        .from('propiedades')
        .select('id, imagen')
        .in('id', propIds)
      
      if (imagenes) {
        imagenesMap = imagenes.reduce((acc: Record<number, string>, p: any) => {
          acc[p.id] = p.imagen || ''
          return acc
        }, {})
      }
    }

    // Obtener los IDs de usuarios únicos
    const usuarioIds = [...new Set((propiedades || [])
      .map((p: any) => p.usuario_id)
      .filter(Boolean))]

    // Obtener nombres de usuarios si hay IDs
    let usuariosMap: Record<string, string> = {}
    if (usuarioIds.length > 0) {
      const { data: usuarios } = await db
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
      usuarioId: prop.usuario_id || undefined,
      titulo: prop.titulo,
      ubicacion: prop.ubicacion,
      precio: Number(prop.precio),
      precioTexto: prop.precio_texto,
      tipo: prop.tipo,
      habitaciones: prop.habitaciones,
      banos: prop.banos,
      area: prop.area,
      areaTexto: prop.area_texto,
      imagen: imagenesMap[prop.id] || '/placeholder-property.jpg',
      descripcion: prop.descripcion || '',
      caracteristicas: prop.caracteristicas || [],
      status: prop.status,
      categoria: prop.categoria,
      fechaPublicacion: prop.fecha_publicacion,
      tourVirtual: prop.tour_virtual || undefined,
      galeria: undefined, // La galería se carga solo en el detalle
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
              usuarioId: newProp.usuario_id || undefined,
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

// Fetcher para cargar una propiedad específica por ID
const fetchPropertyById = async (id: number): Promise<Propiedad | null> => {
  try {
    const db = getQueryClient()
    console.log('Fetching property by ID:', id)
    
    // Primero cargar datos sin imágenes pesadas
    const { data: prop, error } = await (db as any)
      .from('propiedades')
      .select('id, titulo, ubicacion, precio, precio_texto, tipo, habitaciones, banos, area, area_texto, descripcion, caracteristicas, status, categoria, fecha_publicacion, tour_virtual, usuario_id, created_at')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return null
    }
    
    if (!prop) {
      console.log('Property not found:', id)
      return null
    }

    console.log('Property found:', prop.titulo)

    // Cargar imagen y galería en consulta separada
    const { data: mediaData } = await (db as any)
      .from('propiedades')
      .select('imagen, galeria')
      .eq('id', id)
      .single()
    
    const imagen = mediaData?.imagen || '/placeholder-property.jpg'
    const galeria = mediaData?.galeria || []

    // Obtener nombre del usuario si existe
    let agenteNombre = 'Asesor ARKIN'
    if (prop.usuario_id) {
      const { data: usuario } = await (db as any)
        .from('usuarios')
        .select('nombre')
        .eq('id', prop.usuario_id)
        .single()
      
      if (usuario) {
        agenteNombre = usuario.nombre
      }
    }

    return {
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
      imagen: imagen,
      descripcion: prop.descripcion || '',
      caracteristicas: prop.caracteristicas || [],
      status: prop.status,
      categoria: prop.categoria,
      fechaPublicacion: prop.fecha_publicacion,
      tourVirtual: prop.tour_virtual || undefined,
      galeria: galeria,
      agente: {
        nombre: agenteNombre,
        especialidad: 'Especialista en Propiedades',
        rating: 5.0,
        ventas: 0,
        telefono: '+52 1 477 475 6951',
        email: 'arkinselect@gmail.com',
      },
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

// Hook para obtener una propiedad específica - carga directa sin depender de todas las propiedades
export function usePropertyStatic(id: number) {
  const { data: property, isLoading, error } = useSWR(
    id ? `property-${id}` : null,
    () => fetchPropertyById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    property,
    isLoading,
    error,
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

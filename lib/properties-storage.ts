import { Propiedad } from '@/data/propiedades'
import { supabaseOptimized, withRetry } from './supabase/optimized-client'
import type { Database } from './supabase/database.types'
import { propertiesCache, CACHE_KEYS, getCachedOrFetch } from './properties-cache'

type PropiedadRow = Database['public']['Tables']['propiedades']['Row']

export class PropertiesStorage {
  // Convertir de formato DB a formato App
  static dbToApp(dbProp: PropiedadRow): Propiedad {
    return {
      id: Number(dbProp.id),
      titulo: dbProp.titulo,
      ubicacion: dbProp.ubicacion,
      precio: Number(dbProp.precio),
      precioTexto: dbProp.precio_texto,
      tipo: dbProp.tipo,
      habitaciones: dbProp.habitaciones,
      banos: dbProp.banos,
      mediosBanos: (dbProp as any).medios_banos || 0,
      area: dbProp.area,
      areaConstruccion: (dbProp as any).area_construccion || 0,
      cochera: (dbProp as any).cochera || 0,
      areaTexto: dbProp.area_texto,
      imagen: dbProp.imagen || '',
      descripcion: dbProp.descripcion || '',
      caracteristicas: dbProp.caracteristicas || [],
      status: dbProp.status,
      categoria: dbProp.categoria,
      fechaPublicacion: dbProp.fecha_publicacion,
      tourVirtual: dbProp.tour_virtual || undefined,
      galeria: dbProp.galeria || undefined,
    }
  }

  // Validar si un string es un UUID válido
  private static isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

  // Convertir de formato App a formato DB
  private static appToDb(appProp: Omit<Propiedad, 'id'>, usuarioId?: string): any {
    const dbData: any = {
      titulo: appProp.titulo,
      ubicacion: appProp.ubicacion,
      precio: appProp.precio,
      precio_texto: appProp.precioTexto,
      tipo: appProp.tipo,
      habitaciones: appProp.habitaciones,
      banos: appProp.banos,
      area: appProp.area,
      area_texto: appProp.areaTexto,
      imagen: appProp.imagen,
      descripcion: appProp.descripcion,
      caracteristicas: appProp.caracteristicas,
      status: appProp.status,
      categoria: appProp.categoria,
      fecha_publicacion: appProp.fechaPublicacion,
      tour_virtual: appProp.tourVirtual,
      galeria: appProp.galeria,
    }
    
    // Campos opcionales - solo agregar si tienen valor
    // Estos campos pueden no existir en la DB aún
    if (appProp.mediosBanos !== undefined) {
      dbData.medios_banos = appProp.mediosBanos
    }
    if (appProp.areaConstruccion !== undefined) {
      dbData.area_construccion = appProp.areaConstruccion
    }
    if (appProp.cochera !== undefined) {
      dbData.cochera = appProp.cochera
    }

    // Solo incluir usuario_id si es un UUID válido
    if (usuarioId && this.isValidUUID(usuarioId)) {
      dbData.usuario_id = usuarioId
    }

    // Asegurar que no se incluya el id
    delete dbData.id

    return dbData
  }

  // Obtener todas las propiedades con caché
  static async getAll(): Promise<Propiedad[]> {
    return getCachedOrFetch(
      CACHE_KEYS.ALL_PROPERTIES,
      async () => {
        const { data, error } = await withRetry(async () => {
          return supabaseOptimized
            .from('propiedades')
            .select('*')
            .order('created_at', { ascending: false })
        })

        if (error) throw error
        return data?.map(this.dbToApp) || []
      }
    )
  }

  // Obtener una propiedad por ID con caché
  static async getById(id: number): Promise<Propiedad | undefined> {
    return getCachedOrFetch(
      CACHE_KEYS.PROPERTY_BY_ID(id),
      async () => {
        const { data, error } = await withRetry(async () => {
          return supabaseOptimized
            .from('propiedades')
            .select('*')
            .eq('id', id)
            .single()
        })

        if (error) throw error
        return data ? this.dbToApp(data) : undefined
      }
    )
  }

  // Verificar si existe una propiedad con el mismo título y ubicación
  static async checkDuplicate(titulo: string, ubicacion: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseOptimized
        .from('propiedades')
        .select('id')
        .ilike('titulo', titulo)
        .ilike('ubicacion', ubicacion)
        .limit(1)

      if (error) throw error
      return (data?.length || 0) > 0
    } catch (error) {
      console.error('Error checking duplicate:', error)
      return false
    }
  }

  // Verificar si una imagen ya existe en alguna propiedad
  // Nota: Solo verifica URLs, no imágenes base64 (son muy largas para consultas)
  static async checkDuplicateImage(imageUrl: string): Promise<boolean> {
    try {
      // No verificar imágenes base64 - son demasiado largas para consultas HTTP
      // y cada imagen base64 es única por naturaleza
      if (imageUrl.startsWith('data:')) {
        return false
      }

      // Solo verificar URLs normales (no base64)
      if (imageUrl.length > 2000) {
        console.warn('Image URL too long for duplicate check, skipping')
        return false
      }

      // Buscar en imagen principal
      const { data: mainImage, error: mainError } = await supabaseOptimized
        .from('propiedades')
        .select('id')
        .eq('imagen', imageUrl)
        .limit(1)

      if (mainError) throw mainError
      if ((mainImage?.length || 0) > 0) return true

      // Buscar en galería - solo si la URL es corta
      const { data: gallery, error: galleryError } = await supabaseOptimized
        .from('propiedades')
        .select('id, galeria')

      if (galleryError) throw galleryError

      for (const prop of (gallery || []) as { id: number; galeria: string[] | null }[]) {
        if (prop.galeria && Array.isArray(prop.galeria)) {
          if (prop.galeria.includes(imageUrl)) return true
        }
      }

      return false
    } catch (error) {
      console.error('Error checking duplicate image:', error)
      return false
    }
  }

  // Agregar nueva propiedad con invalidación de caché
  static async add(property: Omit<Propiedad, 'id'>, usuarioId: string): Promise<Propiedad | null> {
    try {
      // Validar propiedad duplicada
      const isDuplicate = await this.checkDuplicate(property.titulo, property.ubicacion)
      if (isDuplicate) {
        throw new Error('Ya existe una propiedad con el mismo título y ubicación')
      }

      // Validar imagen principal duplicada
      if (property.imagen) {
        const isImageDuplicate = await this.checkDuplicateImage(property.imagen)
        if (isImageDuplicate) {
          throw new Error('La imagen principal ya está siendo usada en otra propiedad')
        }
      }

      // Validar imágenes de galería duplicadas
      if (property.galeria && property.galeria.length > 0) {
        for (const img of property.galeria) {
          const isGalleryImageDuplicate = await this.checkDuplicateImage(img)
          if (isGalleryImageDuplicate) {
            throw new Error(`La imagen de galería "${img}" ya está siendo usada en otra propiedad`)
          }
        }
      }

      const dbData = this.appToDb(property, usuarioId)

      const { data, error } = await withRetry(async () => {
        return supabaseOptimized
          .from('propiedades')
          .insert(dbData)
          .select()
          .single()
      })

      if (error) {
        console.error('PropertiesStorage.add - Error de Supabase:', error)
        throw error
      }
      
      // Invalidar caché para refrescar lista
      propertiesCache.invalidate(CACHE_KEYS.ALL_PROPERTIES)
      
      return data ? this.dbToApp(data) : null
    } catch (error) {
      console.error('PropertiesStorage.add - Error capturado:', error)
      throw error
    }
  }

  // Actualizar propiedad existente con invalidación de caché
  static async update(id: number, updates: Partial<Propiedad>): Promise<Propiedad | null> {
    try {
      const dbData = this.appToDb(updates as any)

      const { data, error } = await withRetry(async () => {
        return supabaseOptimized
          .from('propiedades')
          .update(dbData)
          .eq('id', id)
          .select()
          .single()
      })

      if (error) throw error
      
      // Invalidar cachés relacionados
      propertiesCache.invalidate(CACHE_KEYS.ALL_PROPERTIES)
      propertiesCache.invalidate(CACHE_KEYS.PROPERTY_BY_ID(id))
      
      return data ? this.dbToApp(data) : null
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  }

  // Eliminar propiedad con invalidación de caché
  static async delete(id: number): Promise<boolean> {
    try {
      const { error } = await withRetry(async () => {
        return supabaseOptimized
          .from('propiedades')
          .delete()
          .eq('id', id)
      })

      if (error) throw error
      
      // Invalidar cachés
      propertiesCache.invalidate(CACHE_KEYS.ALL_PROPERTIES)
      propertiesCache.invalidate(CACHE_KEYS.PROPERTY_BY_ID(id))
      
      return true
    } catch (error) {
      console.error('Error deleting property:', error)
      return false
    }
  }

  // Obtener propiedades por asesor con caché
  static async getByAsesor(asesorEmail: string): Promise<Propiedad[]> {
    return getCachedOrFetch(
      CACHE_KEYS.PROPERTIES_BY_ASESOR(asesorEmail),
      async () => {
        // Primero obtener el agente
        const { data: agente, error: agenteError } = await supabaseOptimized
          .from('agentes')
          .select('id')
          .eq('email', asesorEmail)
          .single()

        if (agenteError || !agente) return []

        // Luego obtener las propiedades asociadas
        const { data: relaciones, error: relacionesError } = await supabaseOptimized
          .from('propiedad_agente')
          .select('propiedad_id')
          .eq('agente_id', agente.id)

        if (relacionesError || !relaciones) return []

        const propiedadIds = relaciones.map((r: any) => r.propiedad_id)

        const { data, error } = await supabaseOptimized
          .from('propiedades')
          .select('*')
          .in('id', propiedadIds)

        if (error) throw error
        return data?.map(this.dbToApp) || []
      }
    )
  }

  // Obtener propiedades por categoría con caché
  static async getByCategoria(categoria: string): Promise<Propiedad[]> {
    return getCachedOrFetch(
      CACHE_KEYS.PROPERTIES_BY_CATEGORY(categoria),
      async () => {
        const { data, error } = await withRetry(async () => {
          return supabaseOptimized
            .from('propiedades')
            .select('*')
            .eq('categoria', categoria)
            .order('created_at', { ascending: false })
        })

        if (error) throw error
        return data?.map(this.dbToApp) || []
      }
    )
  }

  // Inicializar con datos mock (solo para desarrollo / fallback)
  static initializeWithMockData(mockData: Propiedad[]): void {
    console.log('Mock data initialization not needed with Supabase')
    // Este método ya no es necesario con Supabase real
    // Los datos se migrarán con el script seed-supabase.ts
  }
}

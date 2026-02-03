import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar service role key para bypasear RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// Mapeo de propiedades conocidas a sus asesores
// Esto se puede actualizar manualmente o detectar automáticamente
const PROPERTY_OWNER_MAP: Record<string, string> = {
  // Propiedades de Lizzie
  'lizzie': 'lizzie@arkin.mx',
  // Propiedades de Daniela
  'daniela': 'daniela@arkin.mx',
  // Propiedades de Ingrid
  'ingrid': 'ingrid@arkin.mx',
}

export async function GET() {
  try {
    // Obtener todas las propiedades sin asesor asignado
    const { data: orphanProps, error } = await supabaseAdmin
      .from('propiedades')
      .select('id, titulo, ubicacion, usuario_id, created_at')
      .or('usuario_id.is.null,usuario_id.eq.')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orphan properties:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // También obtener propiedades con usuario_id vacío o null
    const { data: allProps } = await supabaseAdmin
      .from('propiedades')
      .select('id, titulo, ubicacion, usuario_id, created_at')
      .order('created_at', { ascending: false })

    const orphans = allProps?.filter(p => !p.usuario_id || p.usuario_id.trim() === '') || []

    return NextResponse.json({ 
      orphanProperties: orphans,
      total: orphans.length
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { propertyId, asesorEmail } = body

    if (!propertyId || !asesorEmail) {
      return NextResponse.json({ error: 'propertyId y asesorEmail son requeridos' }, { status: 400 })
    }

    // Actualizar la propiedad con el email del asesor
    const { data, error } = await supabaseAdmin
      .from('propiedades')
      .update({ usuario_id: asesorEmail })
      .eq('id', propertyId)
      .select()
      .single()

    if (error) {
      console.error('Error updating property:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      property: data
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Endpoint para asignar múltiples propiedades a un asesor
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { assignments } = body // Array de { propertyId, asesorEmail }

    if (!assignments || !Array.isArray(assignments)) {
      return NextResponse.json({ error: 'assignments array es requerido' }, { status: 400 })
    }

    const results = []
    for (const { propertyId, asesorEmail } of assignments) {
      const { data, error } = await supabaseAdmin
        .from('propiedades')
        .update({ usuario_id: asesorEmail })
        .eq('id', propertyId)
        .select()
        .single()

      if (error) {
        results.push({ propertyId, error: error.message })
      } else {
        results.push({ propertyId, success: true, asesor: asesorEmail })
      }
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

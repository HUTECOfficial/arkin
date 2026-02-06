import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// GET - Obtener solicitudes (para fotógrafo: todas, para asesor: solo las suyas)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const role = searchParams.get('role')

    let query = supabaseAdmin
      .from('solicitudes_propiedad')
      .select('*')
      .order('created_at', { ascending: false })

    // Si es asesor, solo ver las suyas
    if (role === 'asesor' && email) {
      query = query.eq('asesor_email', email)
    }

    const { data, error } = await query

    if (error) {
      // Si la tabla no existe, devolver array vacío con instrucciones
      if (error.message.includes('solicitudes_propiedad')) {
        return NextResponse.json({ 
          solicitudes: [],
          needsTable: true,
          sql: `CREATE TABLE solicitudes_propiedad (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asesor_email TEXT NOT NULL,
  asesor_nombre TEXT,
  titulo TEXT NOT NULL,
  ubicacion TEXT,
  descripcion TEXT,
  precio_estimado NUMERIC,
  tipo TEXT DEFAULT 'Departamento',
  categoria TEXT DEFAULT 'venta',
  habitaciones INTEGER,
  banos INTEGER,
  area NUMERIC,
  status TEXT DEFAULT 'pendiente',
  notas_fotografo TEXT,
  propiedad_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`
        })
      }
      console.error('Error fetching solicitudes:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ solicitudes: data || [] })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Crear nueva solicitud (asesor envía solicitud)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { asesor_email, asesor_nombre, titulo, ubicacion, descripcion, precio_estimado, tipo, categoria, habitaciones, banos, area } = body

    if (!asesor_email || !titulo) {
      return NextResponse.json({ error: 'Se requiere email del asesor y título' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('solicitudes_propiedad')
      .insert({
        asesor_email,
        asesor_nombre: asesor_nombre || null,
        titulo,
        ubicacion: ubicacion || null,
        descripcion: descripcion || null,
        precio_estimado: precio_estimado || null,
        tipo: tipo || 'Departamento',
        categoria: categoria || 'venta',
        habitaciones: habitaciones || null,
        banos: banos || null,
        area: area || null,
        status: 'pendiente'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating solicitud:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ solicitud: data })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - Actualizar solicitud (fotógrafo actualiza status, agrega notas, vincula propiedad)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notas_fotografo, propiedad_id } = body

    if (!id) {
      return NextResponse.json({ error: 'Se requiere ID de solicitud' }, { status: 400 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (notas_fotografo !== undefined) updateData.notas_fotografo = notas_fotografo
    if (propiedad_id !== undefined) updateData.propiedad_id = propiedad_id

    const { data, error } = await supabaseAdmin
      .from('solicitudes_propiedad')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating solicitud:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ solicitud: data })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

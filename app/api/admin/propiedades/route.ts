import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar service role key para bypasear RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('propiedades')
      .select('id, titulo, ubicacion, precio, precio_texto, usuario_id, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching propiedades:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ propiedades: data || [] })
  } catch (error: any) {
    console.error('Error in propiedades API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

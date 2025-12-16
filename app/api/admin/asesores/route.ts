import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 })
  }

  // Use anon client - usuarios table should allow read access
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('usuarios')
    .select('id,nombre,email,role')
    .eq('role', 'asesor')
    .order('nombre', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const asesores = (data || []).map((u: any) => ({
    id: String(u.id),
    nombre: String(u.nombre || ''),
    email: String(u.email || ''),
  }))

  return NextResponse.json({ asesores })
}

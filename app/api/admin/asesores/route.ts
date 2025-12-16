import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const { data, error } = await supabaseAdmin
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

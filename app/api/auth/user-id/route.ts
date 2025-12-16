import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ userId: data?.id || null })
}

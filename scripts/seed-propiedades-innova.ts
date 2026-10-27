// Inserta (o actualiza) las propiedades de ejemplo hechas con las fotos de Innova.
//   npx tsx scripts/seed-propiedades-innova.ts           → inserta / actualiza
//   npx tsx scripts/seed-propiedades-innova.ts --delete  → las elimina
import { config } from 'dotenv'
import { join } from 'path'
config({ path: join(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function main() {
    const { PROPIEDADES_EJEMPLO } = await import('../lib/innova-media')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { persistSession: false },
    })
    const titulos = PROPIEDADES_EJEMPLO.map((p) => p.titulo)

    if (process.argv.includes('--delete')) {
        const { error } = await supabase.from('propiedades').delete().in('titulo', titulos)
        if (error) throw error
        console.log('🗑️  Propiedades de ejemplo eliminadas')
        return
    }

    const { data: existentes, error: readError } = await supabase.from('propiedades').select('id, titulo').in('titulo', titulos)
    if (readError) throw readError
    const idPorTitulo = new Map((existentes || []).map((p) => [p.titulo, p.id]))

    // Se insertan en orden inverso para que la primera quede como la más reciente
    for (const prop of [...PROPIEDADES_EJEMPLO].reverse()) {
        const id = idPorTitulo.get(prop.titulo)
        const { data, error } = id
            ? await supabase.from('propiedades').update(prop).eq('id', id).select('id').single()
            : await supabase.from('propiedades').insert(prop).select('id').single()
        if (error) throw error
        console.log(`${id ? '♻️  Actualizada' : '✅ Insertada'}: ${prop.titulo} → /propiedades/${data.id}`)
    }
}

main().catch((e) => {
    console.error('❌', e)
    process.exit(1)
})

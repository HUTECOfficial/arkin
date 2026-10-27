import { createClient } from "@supabase/supabase-js"
import type { PropiedadResumen } from "@/lib/articulos"
import { PROPIEDADES_EJEMPLO } from "@/lib/innova-media"

const toResumen = (p: any, i: number): PropiedadResumen => ({
  id: p.id,
  title: p.titulo,
  location: p.ubicacion,
  price: p.precio_texto,
  precio: p.precio,
  tipo: p.tipo,
  type: p.status === "Exclusiva" ? "Exclusiva" : p.tipo,
  beds: p.habitaciones,
  baths: p.banos,
  area: p.area_texto,
  image: p.imagen,
  tone: i === 1 ? "dark" : "clear",
})

// Últimas propiedades publicadas; si Supabase falla o no hay suficientes, usamos las de ejemplo de Innova
export async function getPropiedadesResumen(limite: number): Promise<PropiedadResumen[]> {
  try {
    const { data } = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    })
      .from("propiedades")
      .select("id, titulo, ubicacion, precio, precio_texto, tipo, status, habitaciones, banos, area_texto, imagen")
      .order("created_at", { ascending: false })
      .limit(limite)
    if (data && data.length >= 3) return data.map(toResumen)
  } catch {}
  return PROPIEDADES_EJEMPLO.map(toResumen)
}

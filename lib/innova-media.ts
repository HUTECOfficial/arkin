// Fotos del bucket público "innova-arkin" (Supabase Storage).
// Los originales (20–45 MB) viven en /campina y /el-bosque; el sitio SIEMPRE usa
// las versiones optimizadas en /web/full (1920px, ~260KB) y /web/card (900px, ~60KB).

// El bucket vive en el proyecto principal (jwevn…). Se fija aquí para que las fotos carguen aunque
// el entorno local apunte a otro proyecto de Supabase (.env.development.local).
const INNOVA_PROJECT_URL = process.env.NEXT_PUBLIC_INNOVA_MEDIA_URL || "https://jwevnxyvrktqmzlgfzqj.supabase.co"
const BASE = `${INNOVA_PROJECT_URL}/storage/v1/object/public/innova-arkin/web`

export type InnovaSize = "full" | "card"

/** innovaImg("campina/_MG_6568-HDR") → URL pública de la versión optimizada */
export function innovaImg(name: string, size: InnovaSize = "full") {
  return `${BASE}/${size}/${name}.jpg`
}

export const INNOVA = {
  // Residencia Campiña (tomas al atardecer)
  campinaFachadaAtardecer: "campina/_MG_6568-HDR",
  campinaFachadaLateral: "campina/_MG_6543-HDR",
  campinaDobleAltura: "campina/_MG_6477-HDR",
  campinaSalaCenital: "campina/_MG_6492-HDR",
  campinaSalaCocina: "campina/_MG_6402-HDR",
  campinaCocina: "campina/_MG_6468-HDR",
  campinaComedorNoche: "campina/_MG_6520-HDR",
  campinaTerraza: "campina/_MG_6607-HDR",
  campinaVolado: "campina/_MG_6574-HDR",
  campinaPasilloExterior: "campina/_MG_6546-HDR",
  campinaPasillo: "campina/_MG_5946-HDR",
  campinaAccesoNoche: "campina/_MG_6514-HDR",
  // Casa Jardín La Campiña (tomas de día)
  jardinPatio: "campina/_MG_6191-HDR",
  jardinFachada: "campina/_MG_6055-HDR",
  jardinAcceso: "campina/_MG_6049-HDR",
  jardinExterior: "campina/_MG_6399-HDR",
  jardinComedor: "campina/_MG_6007-HDR",
  jardinSalaComedor: "campina/_MG_6071-HDR",
  jardinEstancia: "campina/_MG_6095-HDR",
  jardinSofa: "campina/_MG_6219",
  jardinFamily: "campina/_MG_6252-HDR",
  jardinRecamara: "campina/_MG_5980-HDR",
  jardinBano: "campina/_MG_5983-HDR",
  jardinCalle: "campina/_MG_6320-HDR",
  // Club El Bosque
  bosqueGolfCiudad: "el-bosque/el-bosque-6",
  bosqueLago: "el-bosque/el-bosque-5",
  bosqueAmenidades: "el-bosque/el-bosque-7",
  bosqueAlberca: "el-bosque/el-bosque-4",
  bosqueAcceso: "el-bosque/el-bosque-3",
  bosqueRestaurante: "el-bosque/el-bosque-1",
  bosqueLounge: "el-bosque/el-bosque-2",
} as const

export interface PropiedadEjemplo {
  titulo: string
  ubicacion: string
  precio: number
  precio_texto: string
  tipo: string
  habitaciones: number
  banos: number
  medios_banos: number
  area: number
  area_construccion: number
  cochera: number
  area_texto: string
  imagen: string
  galeria: string[]
  descripcion: string
  caracteristicas: string[]
  status: "Disponible" | "Exclusiva" | "Reservada"
  categoria: "venta" | "renta" | "especial" | "remate" | "exclusivo"
}

/** Propiedades de ejemplo armadas con las fotos de Innova (se insertan con scripts/seed-propiedades-innova.ts) */
export const PROPIEDADES_EJEMPLO: PropiedadEjemplo[] = [
  {
    titulo: "Residencia Campiña",
    ubicacion: "La Campiña · León, Gto.",
    precio: 16900000,
    precio_texto: "$16,900,000",
    tipo: "Casa",
    habitaciones: 4,
    banos: 4,
    medios_banos: 1,
    area: 600,
    area_construccion: 520,
    cochera: 3,
    area_texto: "520 m²",
    imagen: innovaImg(INNOVA.campinaFachadaAtardecer),
    galeria: [
      INNOVA.campinaFachadaAtardecer,
      INNOVA.campinaDobleAltura,
      INNOVA.campinaSalaCenital,
      INNOVA.campinaCocina,
      INNOVA.campinaSalaCocina,
      INNOVA.campinaComedorNoche,
      INNOVA.campinaTerraza,
      INNOVA.campinaFachadaLateral,
      INNOVA.campinaVolado,
      INNOVA.campinaPasilloExterior,
      INNOVA.campinaPasillo,
      INNOVA.campinaAccesoNoche,
    ].map((n) => innovaImg(n)),
    descripcion:
      "Arquitectura contemporánea en dos niveles con estancia a doble altura, cocina con isla de mármol y una terraza cubierta que se integra al jardín. Grandes ventanales, iluminación arquitectónica y materiales pétreos que se sienten cálidos de día y espectaculares al atardecer.",
    caracteristicas: ["Doble altura", "Cocina equipada", "Terraza", "Jardín", "Estacionamiento", "Seguridad 24/7"],
    status: "Exclusiva",
    categoria: "venta",
  },
  {
    titulo: "Casa Jardín La Campiña",
    ubicacion: "La Campiña · León, Gto.",
    precio: 12800000,
    precio_texto: "$12,800,000",
    tipo: "Casa",
    habitaciones: 3,
    banos: 3,
    medios_banos: 1,
    area: 480,
    area_construccion: 410,
    cochera: 2,
    area_texto: "410 m²",
    imagen: innovaImg(INNOVA.jardinPatio),
    galeria: [
      INNOVA.jardinPatio,
      INNOVA.jardinFachada,
      INNOVA.jardinSalaComedor,
      INNOVA.jardinEstancia,
      INNOVA.jardinComedor,
      INNOVA.jardinSofa,
      INNOVA.jardinFamily,
      INNOVA.jardinRecamara,
      INNOVA.jardinBano,
      INNOVA.jardinExterior,
      INNOVA.jardinAcceso,
      INNOVA.jardinCalle,
    ].map((n) => innovaImg(n)),
    descripcion:
      "Casa de un solo gesto: la planta social se abre por completo a un jardín amplio con fogatero, ideal para la vida en familia. Interiores en madera y tonos naturales, recámara principal con vista al jardín y acabados de diseño en todos los baños.",
    caracteristicas: ["Jardín", "Terraza", "Cocina equipada", "Estacionamiento", "Seguridad 24/7"],
    status: "Disponible",
    categoria: "venta",
  },
  {
    titulo: "Lote Residencial Club El Bosque",
    ubicacion: "Club El Bosque · León, Gto.",
    precio: 7400000,
    precio_texto: "$7,400,000",
    tipo: "Terreno",
    habitaciones: 0,
    banos: 0,
    medios_banos: 0,
    area: 650,
    area_construccion: 0,
    cochera: 0,
    area_texto: "650 m²",
    imagen: innovaImg(INNOVA.bosqueGolfCiudad),
    galeria: [
      INNOVA.bosqueGolfCiudad,
      INNOVA.bosqueLago,
      INNOVA.bosqueAmenidades,
      INNOVA.bosqueAlberca,
      INNOVA.bosqueAcceso,
      INNOVA.bosqueRestaurante,
      INNOVA.bosqueLounge,
    ].map((n) => innovaImg(n)),
    descripcion:
      "Terreno para construir la casa de tus sueños dentro de una comunidad de club: campo de golf, lagos, alberca techada, canchas de tenis y pádel, restaurante y lounge. Vista abierta al campo y a la ciudad.",
    caracteristicas: ["Campo de golf", "Alberca", "Gimnasio", "Seguridad 24/7", "Club house"],
    status: "Exclusiva",
    categoria: "exclusivo",
  },
]

// Artículos editoriales de ARKIN (guías por etapa de vida). Se muestran en el homepage y en /articulos.

import { INNOVA, innovaImg } from "@/lib/innova-media"

export interface ArticuloSeccion {
  titulo: string
  parrafos: string[]
  lista?: string[]
}

export interface Articulo {
  slug: string
  categoria: string
  titulo: string
  extracto: string
  imagen: string
  lectura: string
  fecha: string
  intro: string
  secciones: ArticuloSeccion[]
  cierre: string
  // Criterios para sugerir propiedades relacionadas al final del artículo
  relacionadas: {
    tipos: string[]
    habitacionesMin?: number
    habitacionesMax?: number
    precioMax?: number
  }
}

// Datos mínimos de una propiedad para mostrarla en tarjetas (home, artículos)
export interface PropiedadResumen {
  id?: number
  title: string
  location: string
  price: string
  precio: number
  tipo: string
  type: string
  beds: number
  baths: number
  area: string
  image: string
  tone: "clear" | "dark"
}

export const ARTICULOS: Articulo[] = [
  {
    slug: "casa-ideal-a-los-40",
    categoria: "Etapa 40+",
    titulo: "40 y tantos: la casa que acompaña tu mejor década",
    extracto:
      "Ya no compras para impresionar, compras para vivir bien los próximos 20 años. Esto es lo que de verdad importa.",
    imagen: innovaImg(INNOVA.jardinFamily, "card"),
    lectura: "6 min",
    fecha: "2026-10-07",
    intro:
      "A los 40 cambia la pregunta. Ya no es «¿cuánto me alcanza?», sino «¿cómo quiero vivir?». Los hijos crecen, la carrera se asienta, las rodillas empiezan a opinar y el tiempo se vuelve el lujo más caro. La casa correcta en esta etapa no es la más grande: es la que te devuelve horas, calma y opciones.",
    secciones: [
      {
        titulo: "1. Piensa en 20 años, no en 5",
        parrafos: [
          "Lo que compres hoy probablemente te acompañe hasta los 60. Imagina esa casa cuando los hijos se vayan, cuando lleguen visitas largas o cuando subir tres pisos ya no sea divertido.",
        ],
        lista: [
          "Una recámara en planta baja (o la posibilidad de crearla) vale oro a futuro.",
          "Espacios flexibles: el cuarto de juegos de hoy es el estudio o el cuarto de huéspedes de mañana.",
          "Menos metros bien resueltos le ganan a muchos metros sin uso.",
        ],
      },
      {
        titulo: "2. El trayecto también es parte de la casa",
        parrafos: [
          "Treinta minutos menos de tráfico al día son más de 120 horas al año. Antes de enamorarte de una fachada, haz el recorrido real a la hora pico: escuela, oficina, súper y hospital.",
        ],
      },
      {
        titulo: "3. Tu casa como patrimonio, no solo como hogar",
        parrafos: [
          "A esta edad la propiedad suele ser el activo más importante de la familia. Revisa la plusvalía de la zona, la calidad de construcción y que la documentación esté impecable: escrituras, predial al corriente y uso de suelo claro.",
          "Si todavía estás pagando crédito, valora si te conviene un plazo más corto: terminar de pagar antes del retiro cambia por completo tu tranquilidad financiera.",
        ],
      },
      {
        titulo: "4. Espacios para ti (sí, para ti)",
        parrafos: [
          "Después de años priorizando a todos, está bien buscar ese rincón propio: un jardín para leer, una terraza para cenar con amigos, un estudio con luz natural para trabajar sin interrupciones.",
        ],
      },
    ],
    cierre:
      "La mejor casa a los 40 es la que no tendrás que cambiar en mucho tiempo. En ARKIN te ayudamos a filtrar con esa visión: menos opciones, mejor elegidas.",
    relacionadas: { tipos: ["Casa"], habitacionesMin: 3 },
  },
  {
    slug: "nido-vacio-nueva-etapa",
    categoria: "Etapa 55+",
    titulo: "Nido vacío, nueva etapa: cuándo vender la casa grande",
    extracto:
      "Los hijos se fueron y sobran recámaras. Cómo saber si es momento de cambiar y convertir esos metros en libertad.",
    imagen: innovaImg(INNOVA.bosqueLago, "card"),
    lectura: "5 min",
    fecha: "2026-10-07",
    intro:
      "El día que el último hijo se muda, la casa se siente distinta: más silencio, más mantenimiento y recámaras que solo se abren en Navidad. No hay prisa para decidir, pero sí vale la pena hacerse algunas preguntas honestas.",
    secciones: [
      {
        titulo: "Señales de que la casa ya te queda grande",
        parrafos: ["Si te identificas con varias, quizá sea momento de explorar opciones:"],
        lista: [
          "Pagas mantenimiento, jardinería y servicios de espacios que nadie usa.",
          "Las escaleras o el jardín se volvieron más trabajo que placer.",
          "Viajas más y la casa se queda sola por semanas.",
          "Te gustaría tener más liquidez para disfrutar esta etapa.",
        ],
      },
      {
        titulo: "Hacer «downsizing» no es hacerse chico",
        parrafos: [
          "Cambiar a un espacio más compacto puede significar subir de nivel: un departamento con amenidades, seguridad, elevador y vista; o una casa de una sola planta en un club con lago, golf y restaurante a pasos de tu puerta.",
          "La diferencia de valor entre la casa grande y la nueva puede convertirse en un fondo para viajes, en una inversión que genere renta o en un apoyo para el primer patrimonio de tus hijos.",
        ],
      },
      {
        titulo: "Cómo hacerlo sin estrés",
        parrafos: [],
        lista: [
          "Valúa tu propiedad con datos reales de la zona, no con el precio que «debería» tener.",
          "Define primero a dónde te mudas: evita vender con prisa y rentar en lo que decides.",
          "Haz espacio emocional: elige qué objetos y recuerdos viajan contigo.",
          "Consulta con un asesor fiscal; en algunos casos la venta de casa habitación puede tener beneficios en el ISR.",
        ],
      },
    ],
    cierre:
      "Esta etapa se trata de vivir con ligereza. Si estás pensando en vender tu casa familiar, en ARKIN la presentamos con la fotografía y la estrategia que merece, y te acompañamos a encontrar el siguiente lugar.",
    relacionadas: { tipos: ["Departamento", "Casa"], habitacionesMax: 3 },
  },
  {
    slug: "primer-depa-a-los-30",
    categoria: "Etapa 30+",
    titulo: "Tu primer depa a los 30: antes de que la renta te compre a ti",
    extracto:
      "Pagas renta cada mes y sientes que se va al vacío. Guía práctica para dar el salto a tu primera propiedad.",
    imagen: innovaImg(INNOVA.campinaSalaCocina, "card"),
    lectura: "7 min",
    fecha: "2026-10-07",
    intro:
      "Si llevas años rentando, seguramente ya hiciste la cuenta: lo que pagas al año podría ser parte de un patrimonio. Comprar tu primera propiedad a los 30 no es un sueño lejano, pero sí requiere orden. Aquí va el plan.",
    secciones: [
      {
        titulo: "Paso 1: Conoce tu número real",
        parrafos: [
          "Una regla sana es que la mensualidad del crédito no supere alrededor del 30% de tus ingresos netos. Además del enganche, aparta para gastos de escrituración y avalúo, que suelen sumar entre el 5% y el 8% del valor de la propiedad.",
        ],
      },
      {
        titulo: "Paso 2: Junta fuerzas",
        parrafos: ["No tienes que hacerlo solo. Revisa todas las vías disponibles:"],
        lista: [
          "Tu subcuenta de vivienda (Infonavit o Fovissste) puede sumarse al crédito bancario.",
          "Créditos conyugales o con co-acreditado para aumentar tu capacidad.",
          "Compara el CAT entre bancos, no solo la tasa: una diferencia pequeña son miles de pesos en el tiempo.",
        ],
      },
      {
        titulo: "Paso 3: Compra pensando en tu yo de 35",
        parrafos: [
          "¿Pareja, mascota, home office, hijos? Un segundo cuarto flexible hace que tu primer depa no se vuelva chico en tres años. Y si algún día te mudas, una buena ubicación facilita rentarlo y convertirlo en tu primera inversión.",
        ],
      },
      {
        titulo: "Paso 4: Preventa vs. listo para habitar",
        parrafos: [
          "La preventa puede darte mejor precio y plusvalía, pero implica esperar y confiar en el desarrollador: revisa su historial y que tenga licencias en regla. Un inmueble terminado te permite ver exactamente lo que compras y dejar de pagar renta de inmediato.",
        ],
      },
    ],
    cierre:
      "Tu primer depa es el primer ladrillo de tu patrimonio. Cuéntanos tu presupuesto y tu estilo de vida, y en ARKIN te mostramos opciones que sí tienen sentido para ti.",
    relacionadas: { tipos: ["Departamento"], habitacionesMax: 2, precioMax: 5000000 },
  },
]

export function getArticulo(slug: string) {
  return ARTICULOS.find((a) => a.slug === slug)
}

// Ordena las propiedades por qué tanto encajan con el artículo y devuelve las mejores
export function propiedadesRelacionadas(articulo: Articulo, propiedades: PropiedadResumen[], limite = 3) {
  const { tipos, habitacionesMin, habitacionesMax, precioMax } = articulo.relacionadas
  const puntaje = (p: PropiedadResumen) =>
    (tipos.includes(p.tipo) ? 3 - tipos.indexOf(p.tipo) : 0) +
    (habitacionesMin === undefined || p.beds >= habitacionesMin ? 1 : 0) +
    (habitacionesMax === undefined || (p.beds > 0 && p.beds <= habitacionesMax) ? 1 : 0) +
    (precioMax === undefined || p.precio <= precioMax ? 1 : 0)
  return [...propiedades].sort((a, b) => puntaje(b) - puntaje(a)).slice(0, limite)
}

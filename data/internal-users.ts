import { User, PropertyProgress, Lead, Activity } from '@/types/internal'

// Usuarios del sistema (en producción esto vendría de una base de datos)
export const users: User[] = [
  {
    id: 'admin-1',
    nombre: 'Carlos Mendoza',
    email: 'admin@arkin.mx',
    role: 'admin',
    telefono: '+52 477 475 6951',
    avatar: '/avatars/admin.jpg'
  },
  {
    id: 'asesor-1',
    nombre: 'Ana García',
    email: 'ana@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 123 4567',
    avatar: '/avatars/ana.jpg',
    password: 'ana_arkin2025'
  },
  {
    id: 'asesor-2',
    nombre: 'Roberto Silva',
    email: 'roberto@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 234 5678',
    avatar: '/avatars/roberto.jpg',
    password: 'roberto_arkin2025'
  },
  {
    id: 'asesor-3',
    nombre: 'María López',
    email: 'maria@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 345 6789',
    avatar: '/avatars/maria.jpg',
    password: 'maria_arkin2025'
  },
  {
    id: 'asesor-4',
    nombre: 'Daniela Belmonte',
    email: 'daniela@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7801',
    avatar: '/avatars/daniela.jpg',
    password: 'daniela_arkin2025'
  },
  {
    id: 'asesor-5',
    nombre: 'Subje Hamue',
    email: 'subje@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7802',
    avatar: '/avatars/subje.jpg',
    password: 'subje_arkin2025'
  },
  {
    id: 'asesor-6',
    nombre: 'Gris Ayala',
    email: 'gris@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7803',
    avatar: '/avatars/gris.jpg',
    password: 'gris_arkin2025'
  },
  {
    id: 'asesor-7',
    nombre: 'Lizzie Lazarini',
    email: 'lizzie@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7804',
    avatar: '/avatars/lizzie.jpg',
    password: 'lizzie_arkin2025'
  },
  {
    id: 'asesor-8',
    nombre: 'Ingrid Gonzalez',
    email: 'ingrid@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7805',
    avatar: '/avatars/ingrid.jpg',
    password: 'ingrid_arkin2025'
  },
  {
    id: 'asesor-9',
    nombre: 'Sofía Ayala',
    email: 'sofia.ayala@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7806',
    avatar: '/avatars/sofia.jpg',
    password: 'sofia_arkin2025'
  },
  {
    id: 'asesor-10',
    nombre: 'Elizabeth',
    email: 'elizabeth@arkin.mx',
    role: 'asesor',
    telefono: '+52 477 456 7807',
    avatar: '/avatars/elizabeth.jpg',
    password: 'elizabeth_arkin2025'
  },
  // Propietarios
  {
    id: 'propietario-1',
    nombre: 'Eduardo Sánchez',
    email: 'eduardo@propietario.com',
    role: 'propietario',
    telefono: '+52 477 111 0000',
    avatar: '/avatars/propietario1.jpg',
    propiedadId: 1
  },
  {
    id: 'propietario-2',
    nombre: 'Sofía Hernández',
    email: 'sofia@propietario.com',
    role: 'propietario',
    telefono: '+52 477 222 0000',
    avatar: '/avatars/propietario2.jpg',
    propiedadId: 2
  },
  {
    id: 'propietario-3',
    nombre: 'Ricardo Morales',
    email: 'ricardo@propietario.com',
    role: 'propietario',
    telefono: '+52 477 333 0000',
    avatar: '/avatars/propietario3.jpg',
    propiedadId: 4
  }
]

// Progreso de propiedades por asesor
export const propertyProgress: PropertyProgress[] = [
  {
    propiedadId: 1,
    asesorId: 'asesor-1',
    leads: 15,
    visitas: 8,
    ofertas: 2,
    status: 'en_negociacion',
    ultimaActividad: '2025-01-21T10:30:00',
    notas: 'Cliente interesado en negociar precio'
  },
  {
    propiedadId: 2,
    asesorId: 'asesor-1',
    leads: 23,
    visitas: 12,
    ofertas: 4,
    status: 'activa',
    ultimaActividad: '2025-01-20T15:45:00'
  },
  {
    propiedadId: 3,
    asesorId: 'asesor-2',
    leads: 18,
    visitas: 10,
    ofertas: 3,
    status: 'activa',
    ultimaActividad: '2025-01-21T09:15:00'
  },
  {
    propiedadId: 4,
    asesorId: 'asesor-2',
    leads: 31,
    visitas: 15,
    ofertas: 5,
    status: 'en_negociacion',
    ultimaActividad: '2025-01-21T14:20:00',
    notas: 'Oferta fuerte, pendiente de documentación'
  },
  {
    propiedadId: 6,
    asesorId: 'asesor-3',
    leads: 12,
    visitas: 6,
    ofertas: 1,
    status: 'activa',
    ultimaActividad: '2025-01-19T11:00:00'
  },
  {
    propiedadId: 5,
    asesorId: 'asesor-1',
    leads: 28,
    visitas: 14,
    ofertas: 6,
    status: 'vendida',
    ultimaActividad: '2025-01-18T16:30:00',
    notas: '¡Venta cerrada exitosamente!'
  },
  {
    propiedadId: 7,
    asesorId: 'asesor-1',
    leads: 19,
    visitas: 9,
    ofertas: 3,
    status: 'rentada',
    ultimaActividad: '2025-01-15T12:00:00',
    notas: 'Contrato de renta firmado por 2 años'
  }
]

// Leads recientes
export const leads: Lead[] = [
  {
    id: 'lead-1',
    propiedadId: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+52 477 111 2222',
    mensaje: 'Me interesa agendar una visita para este fin de semana',
    fecha: '2025-01-21T10:30:00',
    status: 'nuevo',
    asesorId: 'asesor-1'
  },
  {
    id: 'lead-2',
    propiedadId: 2,
    nombre: 'Laura Martínez',
    email: 'laura.m@email.com',
    telefono: '+52 477 222 3333',
    mensaje: '¿Está disponible para renta a largo plazo?',
    fecha: '2025-01-20T15:45:00',
    status: 'contactado',
    asesorId: 'asesor-1'
  },
  {
    id: 'lead-3',
    propiedadId: 3,
    nombre: 'Carlos Ramírez',
    email: 'carlos.r@email.com',
    telefono: '+52 477 333 4444',
    mensaje: 'Quiero hacer una oferta',
    fecha: '2025-01-21T09:15:00',
    status: 'calificado',
    asesorId: 'asesor-2'
  },
  {
    id: 'lead-4',
    propiedadId: 4,
    nombre: 'Patricia Gómez',
    email: 'patricia.g@email.com',
    telefono: '+52 477 444 5555',
    mensaje: 'Necesito más información sobre el financiamiento',
    fecha: '2025-01-21T14:20:00',
    status: 'nuevo',
    asesorId: 'asesor-2'
  },
  {
    id: 'lead-5',
    propiedadId: 6,
    nombre: 'Miguel Torres',
    email: 'miguel.t@email.com',
    telefono: '+52 477 555 6666',
    mensaje: '¿Acepta mascotas?',
    fecha: '2025-01-19T11:00:00',
    status: 'contactado',
    asesorId: 'asesor-3'
  }
]

// Actividad reciente
export const activities: Activity[] = [
  {
    id: 'act-1',
    tipo: 'lead',
    propiedadId: 1,
    asesorId: 'asesor-1',
    descripcion: 'Nuevo lead recibido: Juan Pérez',
    fecha: '2025-01-21T10:30:00'
  },
  {
    id: 'act-2',
    tipo: 'visita',
    propiedadId: 4,
    asesorId: 'asesor-2',
    descripcion: 'Visita programada para el 25 de enero',
    fecha: '2025-01-21T14:20:00'
  },
  {
    id: 'act-3',
    tipo: 'oferta',
    propiedadId: 3,
    asesorId: 'asesor-2',
    descripcion: 'Nueva oferta recibida: $8,200,000',
    fecha: '2025-01-21T09:15:00'
  },
  {
    id: 'act-4',
    tipo: 'nota',
    propiedadId: 2,
    asesorId: 'asesor-1',
    descripcion: 'Cliente solicita información adicional sobre amenidades',
    fecha: '2025-01-20T15:45:00'
  }
]

// Función de autenticación simple (en producción usar un sistema real)
export function authenticateUser(email: string, password: string): User | null {
  const user = users.find(u => u.email === email)
  if (!user) return null
  // Prioriza contraseña personalizada si existe; mantiene compatibilidad con la global
  if (user.password) {
    return user.password === password ? user : null
  }
  return password === 'arkin2025' ? user : null
}

// Obtener progreso por asesor
export function getProgressByAsesor(asesorId: string): PropertyProgress[] {
  return propertyProgress.filter(p => p.asesorId === asesorId)
}

// Obtener leads por asesor
export function getLeadsByAsesor(asesorId: string): Lead[] {
  return leads.filter(l => l.asesorId === asesorId)
}

// Obtener actividades por asesor
export function getActivitiesByAsesor(asesorId: string): Activity[] {
  return activities.filter(a => a.asesorId === asesorId)
}

import type { City, EventCategory, EventStatus, NeedStatus, NeedType, Role, VenueSupportMode } from './domain'

export const CITY_LABELS: Record<City, string> = {
  pereira: 'Pereira',
  dosquebradas: 'Dosquebradas',
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  tecnologia: 'Tecnología',
  literatura: 'Literatura',
  cine: 'Cine',
  musica: 'Música',
  educacion: 'Educación',
  emprendimiento: 'Emprendimiento',
  cultura: 'Cultura',
  comunidades: 'Comunidades',
  networking: 'Networking',
}

export const ROLE_LABELS: Record<Role, string> = {
  organizer: 'Organizador',
  venue_sponsor: 'Venue sponsor',
  local_sponsor: 'Local sponsor',
  moderator: 'Moderador',
}

export const NEED_LABELS: Record<NeedType, string> = {
  venue: 'Espacio',
  products: 'Productos',
  food: 'Alimentación',
  equipment: 'Equipos',
  services: 'Servicios',
  diffusion: 'Difusión',
}

export const SUPPORT_LABELS: Record<VenueSupportMode, string> = {
  free: 'Apoya gratis',
  depends: 'Depende del evento',
  rental_only: 'Solo alquila',
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'Borrador',
  published: 'Buscando apoyo',
  public: 'En agenda',
  completed: 'Realizado',
  cancelled: 'Cancelado',
}

export const NEED_STATUS_LABELS: Record<NeedStatus, string> = {
  open: 'Abierta',
  partial: 'Cubierta a medias',
  covered: 'Cubierta',
  cancelled: 'Cancelada',
}

/** Post-evento: el reporte muestra si se cubrió, no si sigue “abierta”. */
export const EVIDENCE_NEED_STATUS_LABELS: Record<NeedStatus, string> = {
  open: 'No cubierta',
  partial: 'Cubierta a medias',
  covered: 'Cubierta',
  cancelled: 'Cancelada',
}

export const SEAL_LABELS = {
  en_la_red: 'En la red',
  aliado_activo: 'Aliado activo',
} as const

export const OFFER_STATUS_LABELS = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
} as const

export const EVIDENCE_STATUS_LABELS = {
  submitted: 'Enviada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
} as const

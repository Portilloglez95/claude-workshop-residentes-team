export const ESTADOS_TICKET = ['abierto', 'en_proceso', 'cerrado'] as const
export type EstadoTicket = (typeof ESTADOS_TICKET)[number]

export const URGENCIAS_TICKET = ['alta', 'media', 'baja'] as const
export type UrgenciaTicket = (typeof URGENCIAS_TICKET)[number]

export const CATEGORIAS_TICKET = [
  'mantenimiento',
  'ruido',
  'seguridad',
  'areas_comunes',
  'otro',
] as const
export type CategoriaTicket = (typeof CATEGORIAS_TICKET)[number]

export type RolAutor = 'residente' | 'administracion'

export type RespuestaTicket = {
  id: string
  autor: string
  rol: RolAutor
  mensaje: string
  /** ISO 8601 */
  fecha: string
}

export type Ticket = {
  id: string
  titulo: string
  categoria: CategoriaTicket
  urgencia: UrgenciaTicket
  descripcion: string
  fotoUrl?: string
  /**
   * Solo lectura desde la vista de residente — el estado lo cambia
   * administración. El mock simula esa fuente de verdad externa.
   */
  estado: EstadoTicket
  /** ISO 8601 */
  fechaCreacion: string
  respuestas: RespuestaTicket[]
}

export type NuevoTicketInput = {
  titulo: string
  categoria: CategoriaTicket
  urgencia: UrgenciaTicket
  descripcion: string
  fotoUrl?: string
}

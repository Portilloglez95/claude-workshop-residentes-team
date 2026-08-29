export const ESTADOS_RESERVA = [
  'pendiente',
  'confirmada',
  'cancelada',
  'rechazada',
] as const
export type EstadoReserva = (typeof ESTADOS_RESERVA)[number]

export type AreaComun = {
  id: string
  nombre: string
  descripcion: string
  capacidad: number
  /** "HH:mm" */
  horarioApertura: string
  /** "HH:mm" */
  horarioCierre: string
  duracionBloqueHoras: number
  /** 0 = sin costo */
  costo: number
  /**
   * Áreas muy solicitadas o exclusivas requieren aprobación de
   * administración; el resto se confirma de inmediato al reservar.
   */
  requiereAprobacion: boolean
}

export type Reserva = {
  id: string
  areaId: string
  /** "YYYY-MM-DD" */
  fecha: string
  /** "HH:mm" */
  horaInicio: string
  /** "HH:mm" */
  horaFin: string
  estado: EstadoReserva
  residente: string
  notas?: string
  /** Motivo cuando administración rechaza o comentario al confirmar. */
  respuestaAdministracion?: string
  /** ISO 8601 */
  fechaCreacion: string
}

export type NuevaReservaInput = {
  areaId: string
  fecha: string
  horaInicio: string
  horaFin: string
  notas?: string
}

export type BloqueHorario = {
  horaInicio: string
  horaFin: string
  disponible: boolean
}

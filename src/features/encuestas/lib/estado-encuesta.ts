import type { Encuesta } from '../types'

const MS_POR_DIA = 24 * 60 * 60 * 1000

/**
 * Una encuesta está cerrada si el backend la marcó como tal (administración
 * puede cerrarla antes de tiempo) o si ya pasó su fecha de cierre.
 */
export function estaCerrada(encuesta: Encuesta, ahora = new Date()): boolean {
  return encuesta.estado === 'cerrada' || new Date(encuesta.fechaCierre) <= ahora
}

/** Días completos que faltan para el cierre. Negativo si ya venció. */
export function diasParaCierre(fechaIso: string, ahora = Date.now()): number {
  return Math.ceil((new Date(fechaIso).getTime() - ahora) / MS_POR_DIA)
}

/** Cierra hoy o mañana: se destaca para que no se pase la fecha. */
export function esUrgente(encuesta: Encuesta): boolean {
  return !estaCerrada(encuesta) && diasParaCierre(encuesta.fechaCierre) <= 1
}

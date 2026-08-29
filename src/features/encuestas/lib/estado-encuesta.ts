import type { Encuesta } from '../types'

/**
 * Una encuesta está cerrada si el backend la marcó como tal (administración
 * puede cerrarla antes de tiempo) o si ya pasó su fecha de cierre.
 */
export function estaCerrada(encuesta: Encuesta, ahora = new Date()): boolean {
  return encuesta.estado === 'cerrada' || new Date(encuesta.fechaCierre) <= ahora
}

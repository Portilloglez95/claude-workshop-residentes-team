import type { Encuesta } from '../types'
import { estaCerrada } from './estado-encuesta'

/**
 * Abiertas primero (las que cierran antes, primero — son las urgentes),
 * después las cerradas de la más reciente a la más antigua.
 */
export function sortEncuestas(encuestas: Encuesta[]): Encuesta[] {
  const ahora = new Date()
  return [...encuestas].sort((a, b) => {
    const aCerrada = estaCerrada(a, ahora)
    const bCerrada = estaCerrada(b, ahora)
    if (aCerrada !== bCerrada) return aCerrada ? 1 : -1

    const aCierre = new Date(a.fechaCierre).getTime()
    const bCierre = new Date(b.fechaCierre).getTime()
    return aCerrada ? bCierre - aCierre : aCierre - bCierre
  })
}

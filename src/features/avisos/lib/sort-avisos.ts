import type { Aviso } from '../types'

/** Fijados primero (más recientes primero entre ellos), luego el resto en orden cronológico descendente. */
export function sortAvisos(avisos: Aviso[]): Aviso[] {
  return [...avisos].sort((a, b) => {
    if (a.fijado !== b.fijado) return a.fijado ? -1 : 1
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  })
}

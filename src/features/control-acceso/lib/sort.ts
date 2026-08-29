import type { EstadoVisita, Paquete, Visita } from '../types'

/** Pendientes primero, y dentro de cada grupo el más reciente arriba. */
export function sortPaquetes(paquetes: Paquete[]): Paquete[] {
  return [...paquetes].sort((a, b) => {
    if (a.estado !== b.estado) return a.estado === 'pendiente' ? -1 : 1
    return new Date(b.recibidoEn).getTime() - new Date(a.recibidoEn).getTime()
  })
}

const PRIORIDAD_VISITA: Record<EstadoVisita, number> = {
  en_condominio: 0,
  esperada: 1,
  finalizada: 2,
  cancelada: 3,
}

/** Activas y esperadas primero; luego finalizadas/canceladas por fecha desc. */
export function sortVisitas(visitas: Visita[]): Visita[] {
  return [...visitas].sort((a, b) => {
    if (PRIORIDAD_VISITA[a.estado] !== PRIORIDAD_VISITA[b.estado]) {
      return PRIORIDAD_VISITA[a.estado] - PRIORIDAD_VISITA[b.estado]
    }
    return new Date(b.creadaEn).getTime() - new Date(a.creadaEn).getTime()
  })
}

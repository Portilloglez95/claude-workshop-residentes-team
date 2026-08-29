import type { Paquete, Visita } from '../types'
import type { VisitaOverride } from '../store/use-control-acceso-store'

/**
 * Combina la lista base del mock del backend con el estado de cliente
 * (registros nuevos + overrides). Los registros locales van primero porque
 * son los más recientes.
 */
export function mergePaquetes(
  base: Paquete[],
  locales: Paquete[],
  entregas: Record<string, string>,
): Paquete[] {
  return [...locales, ...base].map((paquete) => {
    const entregadoEn = entregas[paquete.id]
    if (!entregadoEn) return paquete
    return { ...paquete, estado: 'entregado', entregadoEn }
  })
}

export function mergeVisitas(
  base: Visita[],
  locales: Visita[],
  overrides: Record<string, VisitaOverride>,
): Visita[] {
  return [...locales, ...base].map((visita) => {
    const override = overrides[visita.id]
    if (!override) return visita
    return {
      ...visita,
      estado: override.estado,
      entradaEn: override.entradaEn ?? visita.entradaEn,
      salidaEn: override.salidaEn ?? visita.salidaEn,
    }
  })
}

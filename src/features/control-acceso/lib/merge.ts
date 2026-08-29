import type { Visita } from '../types'

/**
 * Combina las visitas del mock del backend con las que el residente
 * pre-autorizó en el cliente, y aplica las cancelaciones locales. Las
 * pre-autorizadas van primero porque son las más recientes.
 */
export function mergeVisitas(
  base: Visita[],
  creadas: Visita[],
  canceladas: Record<string, true>,
): Visita[] {
  return [...creadas, ...base].map((visita) =>
    canceladas[visita.id] ? { ...visita, estado: 'cancelada' } : visita,
  )
}

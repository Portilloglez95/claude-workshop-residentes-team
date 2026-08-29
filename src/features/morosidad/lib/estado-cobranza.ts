import type { CuentaMorosa, EstadoCobranza } from '../types'
import { calcularMoraCuenta } from './calcular-mora'

/**
 * Umbrales de escalamiento en días de atraso de la cuota más antigua.
 * Son los mismos que usa el reglamento para justificar cada acción de
 * cobranza, por eso viven junto al cálculo de estado y no en la UI.
 */
export const DIAS_GESTION_COBRANZA = 60
export const DIAS_PROCESO_LEGAL = 90

/** De menos a más severo. Se usa para comparar el estado del backend con el derivado. */
const SEVERIDAD: EstadoCobranza[] = ['al_dia', 'en_mora', 'en_gestion', 'proceso_legal']

export const ESTADO_LABEL: Record<EstadoCobranza, string> = {
  al_dia: 'Al día',
  en_mora: 'En mora',
  en_gestion: 'En gestión de cobranza',
  proceso_legal: 'En proceso legal',
}

/** Estado que corresponde por antigüedad de la deuda, sin intervención humana. */
export function estadoPorAtraso(diasAtrasoMax: number): EstadoCobranza {
  if (diasAtrasoMax <= 0) return 'al_dia'
  if (diasAtrasoMax > DIAS_PROCESO_LEGAL) return 'proceso_legal'
  if (diasAtrasoMax > DIAS_GESTION_COBRANZA) return 'en_gestion'
  return 'en_mora'
}

/**
 * Estado real de la cuenta: el más severo entre el que marca el backend y el
 * que corresponde por antigüedad. Administración puede adelantar el
 * escalamiento (convenio incumplido, reincidencia), pero nunca puede dejar
 * una cuenta en un estado más benigno del que indica su atraso.
 */
export function estadoCobranza(cuenta: CuentaMorosa, ahora = new Date()): EstadoCobranza {
  const derivado = estadoPorAtraso(calcularMoraCuenta(cuenta, ahora).diasAtrasoMax)
  if (cuenta.estado === null) return derivado
  return SEVERIDAD.indexOf(cuenta.estado) > SEVERIDAD.indexOf(derivado)
    ? cuenta.estado
    : derivado
}

/** Índice de severidad, para ordenar listados de la cuenta más crítica a la menos. */
export function severidadEstado(estado: EstadoCobranza): number {
  return SEVERIDAD.indexOf(estado)
}

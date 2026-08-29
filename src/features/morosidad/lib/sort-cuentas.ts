import type { CuentaMorosa } from '../types'
import { calcularMoraCuenta } from './calcular-mora'
import { estadoCobranza, severidadEstado } from './estado-cobranza'

/**
 * Las cuentas más críticas primero (por estado de cobranza) y, dentro del
 * mismo estado, las de mayor deuda: es el orden en que administración
 * trabaja la cartera.
 */
export function sortCuentas(cuentas: CuentaMorosa[]): CuentaMorosa[] {
  const ahora = new Date()
  return [...cuentas].sort((a, b) => {
    const severidad =
      severidadEstado(estadoCobranza(b, ahora)) -
      severidadEstado(estadoCobranza(a, ahora))
    if (severidad !== 0) return severidad

    return calcularMoraCuenta(b, ahora).total - calcularMoraCuenta(a, ahora).total
  })
}

import type { CuentaMorosa, EstadoCobranza } from '../types'
import { calcularMoraCuenta } from './calcular-mora'
import { calcularAging } from './aging'
import { estadoCobranza } from './estado-cobranza'

export type ResumenCartera = {
  /** Deuda exigible hoy de toda la cartera: capital + recargos + intereses. */
  deudaTotal: number
  capital: number
  /** Recargos e intereses moratorios devengados. */
  moraDevengada: number
  /** Unidades con al menos una cuota vencida (excluye las que solo tienen saldo por vencer). */
  unidadesEnMora: number
  /** Saldo con más de 90 días de atraso: el candidato a cobro judicial. */
  saldoMas90: number
  porEstado: Record<EstadoCobranza, number>
}

export function calcularResumenCartera(
  cuentas: CuentaMorosa[],
  ahora = new Date(),
): ResumenCartera {
  const porEstado: Record<EstadoCobranza, number> = {
    al_dia: 0,
    en_mora: 0,
    en_gestion: 0,
    proceso_legal: 0,
  }

  let deudaTotal = 0
  let capital = 0
  let moraDevengada = 0
  let unidadesEnMora = 0

  for (const cuenta of cuentas) {
    const mora = calcularMoraCuenta(cuenta, ahora)
    deudaTotal += mora.total
    capital += mora.capital
    moraDevengada += mora.recargos + mora.intereses
    if (mora.cuotasVencidas > 0) unidadesEnMora += 1
    porEstado[estadoCobranza(cuenta, ahora)] += 1
  }

  const saldoMas90 =
    calcularAging(cuentas, ahora).find((fila) => fila.tramo.id === 'd90_mas')?.monto ?? 0

  return {
    deudaTotal: Math.round(deudaTotal * 100) / 100,
    capital: Math.round(capital * 100) / 100,
    moraDevengada: Math.round(moraDevengada * 100) / 100,
    unidadesEnMora,
    saldoMas90,
    porEstado,
  }
}

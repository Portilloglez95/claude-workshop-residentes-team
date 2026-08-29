import type { CuentaMorosa } from '../types'
import { calcularMoraCuota } from './calcular-mora'

export type TramoAging = 'por_vencer' | 'd1_30' | 'd31_60' | 'd61_90' | 'd90_mas'

type DefinicionTramo = {
  id: TramoAging
  label: string
  /** Días mínimos de atraso del tramo. */
  desde: number
  /** Días máximos de atraso, o `null` si el tramo no tiene tope. */
  hasta: number | null
}

/** Tramos de antigüedad de saldos, del más nuevo al más viejo. */
export const TRAMOS_AGING: DefinicionTramo[] = [
  { id: 'por_vencer', label: 'Por vencer', desde: -Infinity, hasta: 0 },
  { id: 'd1_30', label: '1 a 30 días', desde: 1, hasta: 30 },
  { id: 'd31_60', label: '31 a 60 días', desde: 31, hasta: 60 },
  { id: 'd61_90', label: '61 a 90 días', desde: 61, hasta: 90 },
  { id: 'd90_mas', label: 'Más de 90 días', desde: 91, hasta: null },
]

export function tramoDeAging(diasAtraso: number): TramoAging {
  const tramo = TRAMOS_AGING.find(
    ({ desde, hasta }) => diasAtraso >= desde && (hasta === null || diasAtraso <= hasta),
  )
  return tramo?.id ?? 'd90_mas'
}

export type FilaAging = {
  tramo: DefinicionTramo
  /** Deuda del tramo, ya con recargo e interés devengados. */
  monto: number
  /** Cuántas unidades distintas tienen saldo en el tramo. */
  unidades: number
  /** Participación del tramo sobre el total de la cartera, 0–100 redondeado. */
  porcentaje: number
}

/**
 * Antigüedad de saldos (aging) de toda la cartera. Se calcula por cuota, no
 * por unidad: una misma unidad puede tener una cuota de 15 días y otra de
 * 120, y el comité necesita ver el saldo viejo separado del reciente.
 */
export function calcularAging(cuentas: CuentaMorosa[], ahora = new Date()): FilaAging[] {
  const montoPorTramo = new Map<TramoAging, number>()
  const unidadesPorTramo = new Map<TramoAging, Set<string>>()

  for (const cuenta of cuentas) {
    for (const cuota of cuenta.cuotas) {
      const mora = calcularMoraCuota(cuota, ahora)
      if (mora.capital <= 0) continue

      const tramo = tramoDeAging(mora.diasAtraso)
      montoPorTramo.set(tramo, (montoPorTramo.get(tramo) ?? 0) + mora.total)

      const unidades = unidadesPorTramo.get(tramo) ?? new Set<string>()
      unidades.add(cuenta.unidad)
      unidadesPorTramo.set(tramo, unidades)
    }
  }

  const total = [...montoPorTramo.values()].reduce((suma, monto) => suma + monto, 0)

  return TRAMOS_AGING.map((tramo) => {
    const monto = montoPorTramo.get(tramo.id) ?? 0
    return {
      tramo,
      monto: Math.round(monto * 100) / 100,
      unidades: unidadesPorTramo.get(tramo.id)?.size ?? 0,
      porcentaje: total === 0 ? 0 : Math.round((monto / total) * 100),
    }
  })
}

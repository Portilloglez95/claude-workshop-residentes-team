import type { CuentaMorosa, Cuota } from '../types'

/**
 * Parámetros de mora del condominio. Están aquí (y no dispersos en la UI)
 * porque son reglas de negocio que la asamblea puede cambiar; cuando exista
 * backend deben venir de la configuración del condominio, no del frontend.
 */

/** Días posteriores al vencimiento antes de que se devenguen recargo e intereses. */
export const DIAS_GRACIA = 5
/** Recargo fijo por mora: se aplica una sola vez por cuota, sobre el capital pendiente. */
export const RECARGO_MORA = 0.05
/** Interés moratorio nominal mensual; se prorratea por día efectivo de mora. */
export const INTERES_MORATORIO_MENSUAL = 0.02

const DIAS_DEL_MES = 30
const MS_POR_DIA = 24 * 60 * 60 * 1000

function redondear(monto: number): number {
  return Math.round(monto * 100) / 100
}

export type MoraCuota = {
  cuota: Cuota
  /** Capital pendiente de la cuota (`monto - abonado`). */
  capital: number
  /** Días transcurridos desde el vencimiento. Es 0 mientras la cuota no venza. */
  diasAtraso: number
  /** Días que efectivamente devengan mora (atraso menos los días de gracia). */
  diasEnMora: number
  recargo: number
  interes: number
  /** Capital + recargo + interés. */
  total: number
}

export type MoraCuenta = {
  capital: number
  recargos: number
  intereses: number
  /** Deuda total exigible hoy: capital + recargos + intereses. */
  total: number
  /** Atraso de la cuota más antigua sin pagar; es el que dispara el escalamiento. */
  diasAtrasoMax: number
  cuotasVencidas: number
  /** Detalle por cuota, de la más antigua a la más reciente. */
  detalle: MoraCuota[]
}

/**
 * Mora de una cuota: recargo fijo (una vez) más interés moratorio diario,
 * ambos solo después de los días de gracia. Antes de la gracia la cuota
 * está vencida pero no genera cargos, que es la regla habitual en los
 * reglamentos internos.
 */
export function calcularMoraCuota(cuota: Cuota, ahora = new Date()): MoraCuota {
  const capital = redondear(Math.max(cuota.monto - cuota.abonado, 0))
  const diasAtraso = Math.max(
    Math.floor(
      (ahora.getTime() - new Date(cuota.fechaVencimiento).getTime()) / MS_POR_DIA,
    ),
    0,
  )
  const diasEnMora = Math.max(diasAtraso - DIAS_GRACIA, 0)

  const generaMora = capital > 0 && diasEnMora > 0
  const recargo = generaMora ? redondear(capital * RECARGO_MORA) : 0
  const interes = generaMora
    ? redondear((capital * INTERES_MORATORIO_MENSUAL * diasEnMora) / DIAS_DEL_MES)
    : 0

  return {
    cuota,
    capital,
    diasAtraso,
    diasEnMora,
    recargo,
    interes,
    total: redondear(capital + recargo + interes),
  }
}

/** Agrega la mora de todas las cuotas pendientes de una unidad. */
export function calcularMoraCuenta(cuenta: CuentaMorosa, ahora = new Date()): MoraCuenta {
  const detalle = cuenta.cuotas
    .map((cuota) => calcularMoraCuota(cuota, ahora))
    .filter((mora) => mora.capital > 0)
    .sort(
      (a, b) =>
        new Date(a.cuota.fechaVencimiento).getTime() -
        new Date(b.cuota.fechaVencimiento).getTime(),
    )

  const vencidas = detalle.filter((mora) => mora.diasAtraso > 0)

  return {
    capital: redondear(detalle.reduce((suma, mora) => suma + mora.capital, 0)),
    recargos: redondear(detalle.reduce((suma, mora) => suma + mora.recargo, 0)),
    intereses: redondear(detalle.reduce((suma, mora) => suma + mora.interes, 0)),
    total: redondear(detalle.reduce((suma, mora) => suma + mora.total, 0)),
    diasAtrasoMax: vencidas.reduce((max, mora) => Math.max(max, mora.diasAtraso), 0),
    cuotasVencidas: vencidas.length,
    detalle,
  }
}

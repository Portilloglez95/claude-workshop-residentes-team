/**
 * Moneda del condominio. Cuando exista backend debe venir de la
 * configuración del condominio (no todos los clientes facturan en la misma).
 */
const MONEDA = 'USD'

const formatterMonto = new Intl.NumberFormat('es', {
  style: 'currency',
  currency: MONEDA,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatterPorcentaje = new Intl.NumberFormat('es', {
  style: 'percent',
  maximumFractionDigits: 2,
})

export function formatMonto(monto: number): string {
  return formatterMonto.format(monto)
}

export function formatPorcentaje(fraccion: number): string {
  return formatterPorcentaje.format(fraccion)
}

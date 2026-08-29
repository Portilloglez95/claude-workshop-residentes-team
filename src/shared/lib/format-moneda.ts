const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

const formatoCompacto = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** Monto completo: $2,450.00. Para heros, tiles y celdas de tabla. */
export function formatMoneda(monto: number) {
  return formatoMoneda.format(monto)
}

/**
 * Monto abreviado: $2.5k. Solo para ejes y ticks, donde el ancho manda y el
 * valor exacto está disponible en el tooltip y en la vista de tabla.
 */
export function formatMonedaCompacta(monto: number) {
  return formatoCompacto.format(monto)
}

/** Variación porcentual con signo explícito: +8.4% / −3.1%. */
export function formatDelta(actual: number, previo: number) {
  if (previo === 0) return null
  const cambio = ((actual - previo) / previo) * 100
  const signo = cambio > 0 ? '+' : cambio < 0 ? '−' : ''
  return `${signo}${Math.abs(cambio).toFixed(1)}%`
}

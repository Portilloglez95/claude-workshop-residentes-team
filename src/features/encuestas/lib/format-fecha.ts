import { diasParaCierre } from './estado-encuesta'

const formatterFecha = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const formatterRelativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

export function formatFechaEncuesta(fechaIso: string): string {
  return formatterFecha.format(new Date(fechaIso))
}

/**
 * Texto del plazo: "Cierra mañana" mientras siga abierta, "Cerró el 5 de
 * marzo de 2026" una vez vencida. Con `numeric: 'auto'` los plazos cortos
 * salen como "hoy" / "mañana" en vez de "en 0 días" / "en 1 día".
 */
export function formatCierre(fechaIso: string, cerrada: boolean): string {
  if (cerrada) return `Cerró el ${formatFechaEncuesta(fechaIso)}`
  return `Cierra ${formatterRelativo.format(diasParaCierre(fechaIso), 'day')}`
}

const formatterFecha = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const formatterRelativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

const MS_POR_DIA = 24 * 60 * 60 * 1000

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

  const dias = Math.ceil((new Date(fechaIso).getTime() - Date.now()) / MS_POR_DIA)
  return `Cierra ${formatterRelativo.format(dias, 'day')}`
}

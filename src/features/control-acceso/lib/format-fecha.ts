const formatterFechaHora = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** "05 mar, 14:30" — o "—" si no hay fecha. */
export function formatFechaHora(fechaIso: string | null): string {
  if (!fechaIso) return '—'
  return formatterFechaHora.format(new Date(fechaIso))
}

export function esHoy(fechaIso: string | null, ahora = new Date()): boolean {
  if (!fechaIso) return false
  return new Date(fechaIso).toDateString() === ahora.toDateString()
}

/**
 * Formato de fechas compartido entre features (promovido desde
 * `avisos` cuando `tickets` se volvió el segundo consumidor).
 */
const formatoFecha = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const formatoFechaHora = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatFecha(fechaIso: string): string {
  return formatoFecha.format(new Date(fechaIso))
}

export function formatFechaHora(fechaIso: string): string {
  return formatoFechaHora.format(new Date(fechaIso))
}

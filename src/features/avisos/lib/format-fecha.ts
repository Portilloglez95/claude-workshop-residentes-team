const formatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatFechaAviso(fechaIso: string): string {
  return formatter.format(new Date(fechaIso))
}

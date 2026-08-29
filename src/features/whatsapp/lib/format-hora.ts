const formatoHora = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
})

export function formatHora(fechaIso: string): string {
  return formatoHora.format(new Date(fechaIso))
}

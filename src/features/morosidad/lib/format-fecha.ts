const formatterFecha = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const formatterRelativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

const MS_POR_DIA = 24 * 60 * 60 * 1000

export function formatFechaMorosidad(fechaIso: string): string {
  return formatterFecha.format(new Date(fechaIso))
}

/**
 * Texto de la última gestión de cobranza: "Última gestión ayer", o "Sin
 * gestiones" cuando nunca se contactó a la unidad — ese caso es el que
 * administración necesita detectar antes de escalar.
 */
export function formatUltimaGestion(fechaIso: string | null): string {
  if (fechaIso === null) return 'Sin gestiones'

  const dias = Math.round((new Date(fechaIso).getTime() - Date.now()) / MS_POR_DIA)
  return `Última gestión ${formatterRelativo.format(dias, 'day')}`
}

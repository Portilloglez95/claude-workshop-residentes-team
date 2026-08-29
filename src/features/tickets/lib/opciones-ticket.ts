import type { CategoriaTicket, UrgenciaTicket } from '../types'

/**
 * Etiquetas de las opciones de categoría/urgencia: las usa tanto el
 * formulario de creación (Select) como los badges de la lista/detalle,
 * para que no se desincronicen. Los valores válidos viven en `../types`
 * (CATEGORIAS_TICKET / URGENCIAS_TICKET), que es también lo que valida el
 * schema de zod del formulario.
 */
export const CATEGORIA_LABEL: Record<CategoriaTicket, string> = {
  mantenimiento: 'Mantenimiento',
  ruido: 'Ruido',
  seguridad: 'Seguridad',
  areas_comunes: 'Áreas comunes',
  otro: 'Otro',
}

export const URGENCIA_LABEL: Record<UrgenciaTicket, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

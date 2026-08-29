export type CategoriaAviso = 'emergencia' | 'mantenimiento' | 'administrativo' | 'social'

export type Aviso = {
  id: string
  titulo: string
  cuerpo: string
  /** ISO 8601 */
  fecha: string
  autor: string
  categoria: CategoriaAviso
  /** Los avisos fijados se muestran antes que el resto, sin importar la fecha. */
  fijado: boolean
  /**
   * Estado "leído" que trae el mock/backend (simula avisos ya leídos antes
   * de esta sesión). El estado leído por interacción del usuario en esta
   * sesión vive en el cliente — ver `useAvisosLeidosStore`.
   */
  leido: boolean
}

export type Residente = {
  id: string
  nombre: string
  unidad: string
  email: string
  estado: 'al_dia' | 'moroso'
  /**
   * A qué condominio pertenece. Condoo administra varios condominios, así
   * que esto es lo que evita que un residente vea el directorio de otro
   * edificio — ver el comentario en `fetchResidentes`.
   */
  condominioId: string
}

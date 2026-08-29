export type RolUsuario = 'residente' | 'administrador'

export type Usuario = {
  id: string
  nombre: string
  email: string
  rol: RolUsuario
  /** Unidad del residente. `null` para administración. */
  unidad: string | null
}

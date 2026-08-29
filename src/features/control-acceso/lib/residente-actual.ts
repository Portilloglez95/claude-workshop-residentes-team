/**
 * Residente "logueado" para la demo. No hay auth todavía, así que la vista
 * de residente se ancla a esta unidad: solo verá los paquetes y visitas de
 * `unidad`. Cuando exista sesión real, esto sale del token/usuario.
 */
export const RESIDENTE_ACTUAL = {
  nombre: 'Ana Torres',
  unidad: 'C-305',
} as const

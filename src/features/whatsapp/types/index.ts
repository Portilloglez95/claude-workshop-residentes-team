export type RolMensaje = 'residente' | 'administracion'

export type MensajeChat = {
  id: string
  rol: RolMensaje
  texto: string
  /** ISO 8601 */
  fecha: string
  /** Presente cuando el mensaje es una actualización automática de un ticket. */
  ticketId?: string
}

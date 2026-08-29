import type { Ticket } from '@/features/tickets/types'
import type { MensajeChat } from '../types'

function folio(ticket: Ticket): string {
  return `#${ticket.id.toUpperCase()}`
}

/**
 * Deriva mensajes de chat a partir del estado de los tickets: apertura,
 * cada actualización de administración y el cierre. No duplica datos —
 * se recalcula a partir de `tickets.api.ts` en cada render, así que un
 * cambio ahí (nueva respuesta, cierre) aparece aquí sin sincronización
 * manual entre features.
 */
export function mensajesDeTickets(tickets: Ticket[]): MensajeChat[] {
  return tickets.flatMap((ticket) => {
    const mensajes: MensajeChat[] = [
      {
        id: `${ticket.id}-apertura`,
        rol: 'administracion',
        texto: `Recibimos tu ticket ${folio(ticket)} — "${ticket.titulo}". Te avisamos por aquí cualquier avance.`,
        fecha: ticket.fechaCreacion,
        ticketId: ticket.id,
      },
      ...ticket.respuestas
        .filter((respuesta) => respuesta.rol === 'administracion')
        .map((respuesta) => ({
          id: respuesta.id,
          rol: 'administracion' as const,
          texto: `Ticket ${folio(ticket)}: ${respuesta.mensaje}`,
          fecha: respuesta.fecha,
          ticketId: ticket.id,
        })),
    ]

    if (ticket.estado === 'cerrado') {
      const ultimaFecha = ticket.respuestas.at(-1)?.fecha ?? ticket.fechaCreacion
      mensajes.push({
        id: `${ticket.id}-cierre`,
        rol: 'administracion',
        texto: `Ticket ${folio(ticket)} cerrado. Gracias por tu reporte.`,
        fecha: ultimaFecha,
        ticketId: ticket.id,
      })
    }

    return mensajes
  })
}

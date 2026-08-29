import type { Ticket } from '../types'

function ultimaActividad(ticket: Ticket): number {
  const fechas = [ticket.fechaCreacion, ...ticket.respuestas.map((r) => r.fecha)]
  return Math.max(...fechas.map((fecha) => new Date(fecha).getTime()))
}

/** Los tickets con actividad más reciente (reporte o última respuesta) van primero. */
export function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => ultimaActividad(b) - ultimaActividad(a))
}

import { useQuery } from '@tanstack/react-query'
import { useTickets } from '@/features/tickets/hooks/use-tickets'
import { fetchMensajes } from '../api/whatsapp.api'
import { mensajesDeTickets } from '../lib/mensajes-de-tickets'
import type { MensajeChat } from '../types'

function ordenarPorFecha(mensajes: MensajeChat[]): MensajeChat[] {
  return [...mensajes].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  )
}

/**
 * Mezcla la conversación libre (residente ↔ administración) con los
 * mensajes derivados de actualizaciones de tickets, en una sola línea de
 * tiempo — así el residente ve todo en el mismo chat, sin salir de la app.
 */
export function useConversacion() {
  const mensajesQuery = useQuery({
    queryKey: ['whatsapp', 'mensajes'],
    queryFn: fetchMensajes,
  })
  const ticketsQuery = useTickets()

  const mensajes = ordenarPorFecha([
    ...(mensajesQuery.data ?? []),
    ...mensajesDeTickets(ticketsQuery.data ?? []),
  ])

  return {
    mensajes,
    isLoading: mensajesQuery.isLoading || ticketsQuery.isLoading,
    isError: mensajesQuery.isError || ticketsQuery.isError,
  }
}
